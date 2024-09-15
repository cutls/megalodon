import WS from 'isomorphic-ws'
import { v4 as uuid } from 'uuid'
import { EventEmitter } from 'events'
import { WebSocketInterface } from '../megalodon'
import MisskeyAPI from './api_client'
import { isBrowser } from '../default'

/**
 * WebSocket
 * Misskey is not support http streaming. It supports websocket instead of streaming.
 * So this class connect to Misskey server with WebSocket.
 */
export default class WebSocket extends EventEmitter implements WebSocketInterface {
  public url: string
  public channel: 'user' | 'localTimeline' | 'hybridTimeline' | 'globalTimeline' | 'conversation' | 'list'
  public parser: Parser
  public headers: { [key: string]: string }
  public listId: string | null = null
  private _accessToken: string
  private _reconnectInterval: number
  private _reconnectMaxAttempts: number
  private _reconnectCurrentAttempts: number
  private _connectionClosed: boolean
  private _client: WS | null = null
  private _channelID: string

  /**
   * @param url Full url of websocket: e.g. wss://misskey.io/streaming
   * @param channel Channel name is user, localTimeline, hybridTimeline, globalTimeline, conversation or list.
   * @param accessToken The access token.
   * @param listId This parameter is required when you specify list as channel.
   */
  constructor(
    url: string,
    channel: 'user' | 'localTimeline' | 'hybridTimeline' | 'globalTimeline' | 'conversation' | 'list',
    accessToken: string,
    listId: string | undefined,
    userAgent: string
  ) {
    super()
    this.url = url
    this.parser = new Parser()
    this.channel = channel
    this.headers = {
      'User-Agent': userAgent
    }
    if (listId === undefined) {
      this.listId = null
    } else {
      this.listId = listId
    }
    this._accessToken = accessToken
    this._reconnectInterval = 10000
    this._reconnectMaxAttempts = Infinity
    this._reconnectCurrentAttempts = 0
    this._connectionClosed = false
    this._channelID = uuid()
  }

  /**
   * Start websocket connection.
   */
  public start() {
    this._connectionClosed = false
    this._resetRetryParams()
    this._startWebSocketConnection()
  }

  private baseUrlToHost(baseUrl: string): string {
    return baseUrl.replace('https://', '').replace('wss://', '')
  }

  /**
   * Reset connection and start new websocket connection.
   */
  private _startWebSocketConnection() {
    this._resetConnection()
    this._setupParser()
    this._client = this._connect()
    this._bindSocket(this._client)
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
   * Clean up current connection, and listeners.
   */
  private _resetConnection() {
    if (this._client) {
      this._client.close(1000)
      this._clearBinding()
      this._client = null
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
   * Connect to the endpoint.
   */
  private _connect(): WS {
    const requestURL = `${this.url}?i=${this._accessToken}`
    if (isBrowser()) {
      // This is browser.
      // We can't pass options when browser: https://github.com/heineiuo/isomorphic-ws#limitations
      const cli = new WS(requestURL)
      return cli
    } else {
      const options: WS.ClientOptions = {
        headers: this.headers
      }

      const cli: WS = new WS(requestURL, options)
      return cli
    }
  }
  /**
   * Connect specified channels in websocket.
   */
  private _channel() {
    if (!this._client) {
      return
    }
    switch (this.channel) {
      case 'conversation':
        this._client.send(
          JSON.stringify({
            type: 'connect',
            body: {
              channel: 'main',
              id: this._channelID
            }
          })
        )
        break
      case 'user':
        this._client.send(
          JSON.stringify({
            type: 'connect',
            body: {
              channel: 'main',
              id: this._channelID
            }
          })
        )
        this._client.send(
          JSON.stringify({
            type: 'connect',
            body: {
              channel: 'homeTimeline',
              id: this._channelID
            }
          })
        )
        break
      case 'list':
        this._client.send(
          JSON.stringify({
            type: 'connect',
            body: {
              channel: 'userList',
              id: this._channelID,
              params: {
                listId: this.listId
              }
            }
          })
        )
        break
      default:
        this._client.send(
          JSON.stringify({
            type: 'connect',
            body: {
              channel: this.channel,
              id: this._channelID
            }
          })
        )
        break
    }
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
        this._client = this._connect()
        this._bindSocket(this._client)
      }
    }, this._reconnectInterval)
  }

  /**
   * Clear binding event for websocket client.
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
    client.onclose = ({ code }: { code: number }) => {
      if (code === 1000) {
        this.emit('close', {})
      } else {
        console.log(`Closed connection with ${code}`)
        if (!this._connectionClosed) {
          this._reconnect()
        }
      }
    }
    client.onopen = _event => {
      this.emit('connect', {})
      this._channel()
      if (!isBrowser()) {
        // Call first ping event.
        setTimeout(() => {
          client.ping('')
        }, 10000)
      }
    }
    client.onmessage = event => {
      this.parser.parse(event.data, false, this._channelID)
    }
    client.onerror = event => {
      this.emit('error', event.error)
    }
  }

  /**
   * Set up parser when receive message.
   */
  private _setupParser() {
    this.parser.on('update', (note: MisskeyAPI.Entity.Note) => {
      this.emit('update', MisskeyAPI.Converter.note(note, this.baseUrlToHost(this.url)))
    })
    this.parser.on('notification', (notification: MisskeyAPI.Entity.Notification) => {
      this.emit('notification', MisskeyAPI.Converter.notification(notification, this.baseUrlToHost(this.url)))
    })
    this.parser.on('conversation', (note: MisskeyAPI.Entity.Note) => {
      this.emit('conversation', MisskeyAPI.Converter.noteToConversation(note, this.baseUrlToHost(this.url)))
    })
    this.parser.on('error', (err: Error) => {
      this.emit('parser-error', err)
    })
  }
}

/**
 * Parser
 * This class provides parser for websocket message.
 */
export class Parser extends EventEmitter {
  /**
   * @param message Message body of websocket.
   * @param channelID Parse only messages which has same channelID.
   */
  public parse(data: WS.Data, isBinary: boolean, channelID: string) {
    const message = isBinary ? data : data.toString()
    if (typeof message !== 'string') {
      this.emit('heartbeat', {})
      return
    }

    if (message === '') {
      this.emit('heartbeat', {})
      return
    }

    let obj: {
      type: string
      body: {
        id: string
        type: string
        body: any
      }
    }
    let body: {
      id: string
      type: string
      body: any
    }

    try {
      obj = JSON.parse(message)
      if (obj.type !== 'channel') {
        return
      }
      if (!obj.body) {
        return
      }
      body = obj.body
      if (body.id !== channelID) {
        return
      }
    } catch (err) {
      this.emit('error', new Error(`Error parsing websocket reply: ${message}, error message: ${err}`))
      return
    }

    switch (body.type) {
      case 'note':
        this.emit('update', body.body as MisskeyAPI.Entity.Note)
        break
      case 'notification':
        this.emit('notification', body.body as MisskeyAPI.Entity.Notification)
        break
      case 'mention': {
        const note = body.body as MisskeyAPI.Entity.Note
        if (note.visibility === 'specified') {
          this.emit('conversation', note)
        }
        break
      }
      // When renote and followed event, the same notification will be received.
      case 'renote':
      case 'followed':
      case 'follow':
      case 'unfollow':
      case 'receiveFollowRequest':
      case 'meUpdated':
      case 'readAllNotifications':
      case 'readAllUnreadSpecifiedNotes':
      case 'readAllAntennas':
      case 'readAllUnreadMentions':
      case 'unreadNotification':
        // Ignore these events
        break
      default:
        this.emit('error', new Error(`Unknown event has received: ${JSON.stringify(body)}`))
        break
    }
  }
}
