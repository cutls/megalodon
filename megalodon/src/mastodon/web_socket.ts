import WS from 'isomorphic-ws'
import dayjs, { type Dayjs } from 'dayjs'
import { EventEmitter } from 'events'
import type { WebSocketInterface } from '../megalodon.js'
import MastodonAPI from './api_client.js'
import { UnknownNotificationTypeError } from '../notification.js'
import { isBrowser } from '../default.js'

/**
 * Streaming
 * Connect WebSocket streaming endpoint.
 */
export default class Streaming extends EventEmitter implements WebSocketInterface {
	public url: string
	public stream?: string
	public params: string | null
	public parser: Parser
	public headers: { [key: string]: string }
	public channelSubscriptions: Record<string, string>[] = []
	private _accessToken: string
	private _reconnectInterval: number
	private _reconnectMaxAttempts: number
	private _reconnectCurrentAttempts: number
	private _connectionClosed: boolean
	private _client: WS | null
	private _pongReceivedTimestamp: Dayjs
	private _heartbeatInterval = 60000
	private _pongWaiting = false

	/**
	 * @param url Full url of websocket: e.g. https://mastodon.social/api/v1/streaming
	 * @param stream Stream name
	 * @param accessToken The access token.
	 * @param userAgent The specified User Agent.
	 */
	constructor(url: string, stream: string | undefined, params: string | undefined, accessToken: string, userAgent: string) {
		super()
		this.url = url
		this.stream = stream
		if (params === undefined) {
			this.params = null
		} else {
			this.params = params
		}
		this.parser = new Parser()
		this.headers = {
			'User-Agent': userAgent
		}
		this._accessToken = accessToken
		this._reconnectInterval = 10000
		this._reconnectMaxAttempts = Infinity
		this._reconnectCurrentAttempts = 0
		this._connectionClosed = false
		this._client = null
		this._pongReceivedTimestamp = dayjs()
	}

	/**
	 * Start websocket connection.
	 */
	public start() {
		try {
			this._connectionClosed = false
			this._resetRetryParams()
			this._startWebSocketConnection()
		} catch (err) {
			console.error(err)
		}
	}

	/**
	 * Reset connection and start new websocket connection.
	 */
	private _startWebSocketConnection() {
		this._resetConnection()
		this._setupParser()
		const client = this._connect(this.url, this.stream, this.params, this._accessToken, this.headers)
		this._client = client
		if (client) this._bindSocket(client)
	}

	/**
	 * Stop current connection.
	 */
	public stop() {
		this._connectionClosed = true
		this._resetConnection()
		this._resetRetryParams()
	}

	/**
	 * Subscribe stream.
	 */
	public subscribe(name: string, _stream: string, add?: Record<string, string>) {
		this._client?.send(JSON.stringify({ type: 'subscribe', stream: name, ...add }))
		this.channelSubscriptions.push({
			type: 'subscribe',
			stream: name,
			...add
		})
	}

	/**
	 * Unsubscribe stream.
	 */
	public unsubscribe(stream: string) {
		this._client?.send(JSON.stringify({ type: 'unsubscribe', stream }))
		this.channelSubscriptions = this.channelSubscriptions.filter((ch) => !(ch.type === 'subscribe' && ch.stream === stream))
	}

	/**
	 * Clean up current connection, and listeners.
	 */
	private _resetConnection() {
		if (this._client) {
			this._client.close(1000)
			this._clearBinding()
			this._client = null
			this.channelSubscriptions = []
		}

		if (this.parser) {
			this.parser.removeAllListeners()
		}
	}

	/**
	 * Resets the parameters used in reconnect.
	 */
	private _resetRetryParams() {
		this._reconnectCurrentAttempts = 0
	}

	/**
	 * Reconnects to the same endpoint.
	 */
	private _reconnect() {
		setTimeout(() => {
			// Skip reconnect when client is connecting.
			// https://github.com/websockets/ws/blob/7.2.1/lib/websocket.js#L365
			if (this._client && this._client.readyState === WS.CONNECTING) {
				return
			}

			if (this._reconnectCurrentAttempts < this._reconnectMaxAttempts) {
				this._reconnectCurrentAttempts++
				this._clearBinding()
				if (this._client) {
					// In reconnect, we want to close the connection immediately,
					// because recoonect is necessary when some problems occur.
					if (isBrowser()) {
						this._client.close()
					} else {
						this._client.terminate()
					}
				}
				// Call connect methods
				console.log('Reconnecting')
				const client = this._connect(this.url, this.stream, this.params, this._accessToken, this.headers)
				this._client = client
				if (client) this._bindSocket(client)
			}
		}, this._reconnectInterval)
	}

	public reconnect() {
		this._reconnect()
	}

	/**
	 * @param url Base url of streaming endpoint.
	 * @param stream The specified stream name.
	 * @param accessToken Access token.
	 * @param headers The specified headers.
	 * @return A WebSocket instance.
	 */
	private _connect(url: string, stream: string | undefined, params: string | null, accessToken: string, headers: { [key: string]: string }): WS | null {
		const parameter: Array<string> = stream ? [`stream=${stream}`] : []

		if (params) {
			parameter.push(params)
		}

		if (accessToken !== null) {
			parameter.push(`access_token=${accessToken}`)
			headers.Authorization = `Bearer ${accessToken}`
		}
		const requestURL = `${url}?${parameter.join('&')}`
		if (isBrowser()) {
			// This is browser.
			// We can't pass options when browser: https://github.com/heineiuo/isomorphic-ws#limitations
			try {
				const cli = new WS(requestURL)
				return cli
			} catch {
				return null
			}
		} else {
			const options: WS.ClientOptions = {
				headers: headers
			}
			try {
				const cli: WS = new WS(requestURL, options)
				return cli
			} catch {
				return null
			}
		}
	}

	/**
	 * Clear binding event for web socket client.
	 */
	private _clearBinding() {
		if (this._client && !isBrowser()) {
			this._client.removeAllListeners('close')
			this._client.removeAllListeners('pong')
			this._client.removeAllListeners('open')
			this._client.removeAllListeners('message')
			this._client.removeAllListeners('error')
		}
	}

	/**
	 * Bind event for web socket client.
	 * @param client A WebSocket instance.
	 */
	private _bindSocket(client: WS) {
		client.onclose = (event) => {
			// Refer the code: https://tools.ietf.org/html/rfc6455#section-7.4
			if (event.code === 1000) {
				this.emit('close', {})
			} else {
				console.log(`Closed connection with ${event.code}`)
				// If already called close method, it does not retry.
				if (!this._connectionClosed) {
					this._reconnect()
				}
			}
		}
		client.onopen = (_event) => {
			const chsRaw = structuredClone(this.channelSubscriptions)
			const chs = [...new Set(chsRaw.map((e) => JSON.stringify(e)))].map((e) => JSON.parse(e))
			this.channelSubscriptions = []
			if (!chs.length) this.emit('connect', {})
			if (!isBrowser()) {
				// Call first ping event.
				setTimeout(() => {
					client.ping('')
				}, 10000)
			}
			// Resubscribe channels
			for (const ch of chs) {
				client.send(JSON.stringify(ch))
				this.channelSubscriptions.push(ch)
			}
			if (chs.length) {
				this.emit('connect', {})
			}
		}
		client.onmessage = (event) => {
			this.parser.parse(event)
		}
		client.onerror = (event) => {
			this.emit('error', event.error)
		}

		if (!isBrowser()) {
			client.on('pong', () => {
				this._pongWaiting = false
				this.emit('pong', {})
				this._pongReceivedTimestamp = dayjs()
				// It is required to anonymous function since get this scope in checkAlive.
				setTimeout(() => this._checkAlive(this._pongReceivedTimestamp), this._heartbeatInterval)
			})
		}
	}

	/**
	 * Set up parser when receive message.
	 */
	private _setupParser() {
		this.parser.on('update', (status: MastodonAPI.Entity.Status, ch: string[]) => {
			this.emit('update', MastodonAPI.Converter.status(status), ch)
		})
		this.parser.on('notification', (notification: MastodonAPI.Entity.Notification, ch: string[]) => {
			const n = MastodonAPI.Converter.notification(notification)
			if (n instanceof UnknownNotificationTypeError) {
				console.warn(`Unknown notification event has received: ${notification}`)
			} else {
				this.emit('notification', n, ch)
			}
		})
		this.parser.on('delete', (id: string, ch: string[]) => {
			this.emit('delete', id, ch)
		})
		this.parser.on('conversation', (conversation: MastodonAPI.Entity.Conversation, ch: string[]) => {
			this.emit('conversation', MastodonAPI.Converter.conversation(conversation), ch)
		})
		this.parser.on('status_update', (status: MastodonAPI.Entity.Status, ch: string[]) => {
			this.emit('status_update', MastodonAPI.Converter.status(status), ch)
		})
		this.parser.on('error', (err: Error) => {
			this.emit('parser-error', err)
		})
		this.parser.on('heartbeat', (_) => {
			this.emit('heartbeat', 'heartbeat')
		})
	}

	/**
	 * Call ping and wait to pong.
	 */
	private _checkAlive(timestamp: Dayjs) {
		const now: Dayjs = dayjs()
		// Block multiple calling, if multiple pong event occur.
		// It the duration is less than interval, through ping.
		if (now.diff(timestamp) > this._heartbeatInterval - 1000 && !this._connectionClosed) {
			// Skip ping when client is connecting.
			// https://github.com/websockets/ws/blob/7.2.1/lib/websocket.js#L289
			if (this._client && this._client.readyState !== WS.CONNECTING) {
				this._pongWaiting = true
				this._client.ping('')
				setTimeout(() => {
					if (this._pongWaiting) {
						this._pongWaiting = false
						this._reconnect()
					}
				}, 10000)
			}
		}
	}
}

/**
 * Parser
 * This class provides parser for websocket message.
 */
export class Parser extends EventEmitter {
	/**
	 * @param message Message event of websocket.
	 */
	public parse(ev: WS.MessageEvent) {
		const data = ev.data
		const message = data.toString()
		if (typeof message !== 'string') {
			this.emit('heartbeat', {})
			return
		}

		if (message === '') {
			this.emit('heartbeat', {})
			return
		}

		let ch: string[] = []
		let event = ''
		let payload = ''
		let mes = {}
		try {
			const obj = JSON.parse(message)
			event = obj.event
			payload = obj.payload
			ch = obj.stream || []
			mes = JSON.parse(payload)
		} catch (err) {
			// delete event does not have json object
			if (event !== 'delete') {
				this.emit('error', new Error(`Error parsing websocket reply: ${message}, error message: ${err}`))
				return
			}
		}

		switch (event) {
			case 'update':
				this.emit('update', mes as MastodonAPI.Entity.Status, ch)
				break
			case 'notification':
				this.emit('notification', mes as MastodonAPI.Entity.Notification, ch)
				break
			case 'conversation':
				this.emit('conversation', mes as MastodonAPI.Entity.Conversation, ch)
				break
			case 'delete':
				this.emit('delete', payload)
				break
			case 'status.update':
				this.emit('status_update', mes as MastodonAPI.Entity.Status, ch)
				break
			default:
				this.emit('error', new Error(`Unknown event has received: ${message}`))
		}
	}
}
