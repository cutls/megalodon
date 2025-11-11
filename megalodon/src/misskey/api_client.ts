import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios'
import dayjs from 'dayjs'
import FormData from 'form-data'

import { DEFAULT_UA } from '../default.js'
import type Response from '../response.js'
import type MisskeyEntity from './entity.js'
import type MegalodonEntity from '../entity.js'
import WebSocket from './web_socket.js'
import MisskeyNotificationType from './notification.js'
import NotificationType from '../notification.js'
import { isBrowser } from '../default.js'
import AutolinkerImported from 'autolinker'
export const isEmojiArr = (item: any): item is MisskeyEntity.Emoji[] => Array.isArray(item)
function autoLinker(input: string, host: string) {
	const Autolinker = AutolinkerImported as any
	return Autolinker.link(input, {
		hashtag: 'twitter',
		mention: 'twitter',
		email: false,
		stripPrefix: false,
		replaceFn: (match: any) => {
			switch (match.type) {
				case 'url':
					return true
				case 'mention':
					return `<a href="https://${host}/@${encodeURIComponent(match.getMention())}" target="_blank">@${match.getMention()}</a>`
				case 'hashtag':
					return `<a href="https://${host}/tags/${encodeURIComponent(match.getHashtag())}" target="_blank">#${match.getHashtag()}</a>`
			}
			return false
		}
	})
}
namespace MisskeyAPI {
	export namespace Entity {
		export type App = MisskeyEntity.App
		export type Blocking = MisskeyEntity.Blocking
		export type Choice = MisskeyEntity.Choice
		export type CreatedNote = MisskeyEntity.CreatedNote
		export type Emoji = MisskeyEntity.Emoji
		export type EmojiKeyValue = MisskeyEntity.EmojiKeyValue
		export type Favorite = MisskeyEntity.Favorite
		export type File = MisskeyEntity.File
		export type Follower = MisskeyEntity.Follower
		export type Following = MisskeyEntity.Following
		export type FollowRequest = MisskeyEntity.FollowRequest
		export type Hashtag = MisskeyEntity.Hashtag
		export type List = MisskeyEntity.List
		export type Meta = MisskeyEntity.Meta
		export type Mute = MisskeyEntity.Mute
		export type Note = MisskeyEntity.Note
		export type Notification = MisskeyEntity.Notification
		export type Poll = MisskeyEntity.Poll
		export type Reaction = MisskeyEntity.Reaction
		export type Relation = MisskeyEntity.Relation
		export type User = MisskeyEntity.User
		export type UserDetail = MisskeyEntity.UserDetail
		export type UserKey = MisskeyEntity.UserKey
		export type Session = MisskeyEntity.Session
		export type Stats = MisskeyEntity.Stats
		export type APIEmoji = { emojis: Emoji[] }
	}

	export namespace Converter {
		export const emoji = (e: Entity.Emoji): MegalodonEntity.Emoji => {
			return {
				shortcode: e.name,
				static_url: e.url,
				url: e.url,
				visible_in_picker: true
			}
		}

		export const emojiConverter = (e: MisskeyEntity.EmojiKeyValue | MisskeyEntity.Emoji[]) => {
			if (!e) return []
			if (isEmojiArr(e)) return e
			const emojiArr: MisskeyEntity.Emoji[] = Object.entries(e).map(([key, value]) => {
				return {
					name: key,
					host: null,
					url: value,
					aliases: []
				}
			})
			return emojiArr
		}

		export const user = (u: Entity.User, host: string): MegalodonEntity.Account => {
			host = host.replace('https://', '')
			let acct = u.username
			let acctUrl = `https://${host || u.host || 'example.com'}/@${u.username}`
			if (u.host) {
				acct = `${u.username}@${u.host}`
				acctUrl = `https://${u.host}/@${u.username}`
			}
			const localEmojis = emojiExtractor(u.name || '', host).map((e) => emoji(e))
			return {
				id: u.id,
				username: u.username,
				acct: acct,
				display_name: u.name || u.username,
				locked: false,
				created_at: new Date().toISOString(),
				followers_count: 0,
				following_count: 0,
				statuses_count: 0,
				note: '',
				url: acctUrl,
				avatar: u.avatarUrl,
				avatar_static: u.avatarUrl,
				header: u.avatarUrl,
				header_static: u.avatarUrl,
				emojis: [...emojiConverter(u.emojis).map((e) => emoji(e)), ...localEmojis],
				moved: null,
				fields: [],
				bot: false,
				group: false,
				discoverable: false,
				noindex: false,
				suspended: false,
				limited: false
			}
		}

		export const userDetail = (u: Entity.UserDetail, host: string): MegalodonEntity.Account => {
			let acct = u.username
			host = host.replace('https://', '')
			let acctUrl = `https://${host || u.host || 'example.com'}/@${u.username}`
			if (u.host) {
				acct = `${u.username}@${u.host}`
				acctUrl = `https://${u.host}/@${u.username}`
			}
			const localEmojis = emojiExtractor(`${u.name}${u.description}`, host).map((e) => emoji(e))
			return {
				id: u.id,
				username: u.username,
				acct: acct,
				display_name: u.name || u.username,
				locked: !!u.isLocked,
				created_at: u.createdAt || new Date().toISOString(),
				followers_count: u.followersCount || 0,
				following_count: u.followingCount || 0,
				statuses_count: u.notesCount || 0,
				note: u.description || '',
				url: acctUrl,
				avatar: u.avatarUrl || 'https://http.cat/404',
				avatar_static: u.avatarUrl || 'https://http.cat/404',
				header: u.bannerUrl || u.avatarUrl || 'https://http.cat/404',
				header_static: u.bannerUrl || u.avatarUrl || 'https://http.cat/404',
				emojis: [...emojiConverter(u.emojis).map((e) => emoji(e)), ...localEmojis],
				moved: null,
				fields: [],
				bot: u.isBot || false,
				group: false,
				discoverable: false,
				noindex: false,
				suspended: false,
				limited: false
			}
		}

		export const visibility = (v: 'public' | 'home' | 'followers' | 'specified'): 'public' | 'unlisted' | 'private' | 'direct' => {
			switch (v) {
				case 'public':
					return v
				case 'home':
					return 'unlisted'
				case 'followers':
					return 'private'
				case 'specified':
					return 'direct'
			}
		}

		export const encodeVisibility = (v: 'public' | 'unlisted' | 'private' | 'direct'): 'public' | 'home' | 'followers' | 'specified' => {
			switch (v) {
				case 'public':
					return v
				case 'unlisted':
					return 'home'
				case 'private':
					return 'followers'
				case 'direct':
					return 'specified'
			}
		}

		export const fileType = (s: string): 'unknown' | 'image' | 'gifv' | 'video' | 'audio' => {
			if (s === 'image/gif') {
				return 'gifv'
			}
			if (s.includes('image')) {
				return 'image'
			}
			if (s.includes('video')) {
				return 'video'
			}
			if (s.includes('audio')) {
				return 'audio'
			}
			return 'unknown'
		}

		export const file = (f: Entity.File): MegalodonEntity.Attachment => {
			return {
				id: f.id,
				type: fileType(f.type),
				url: f.url,
				remote_url: f.url,
				preview_url: f.thumbnailUrl,
				text_url: f.url,
				meta: {
					width: f.properties.width,
					height: f.properties.height
				},
				description: null,
				blurhash: null
			}
		}

		export const follower = (f: Entity.Follower, host: string): MegalodonEntity.Account => {
			return user(f.follower, host)
		}

		export const following = (f: Entity.Following, host: string): MegalodonEntity.Account => {
			return user(f.followee, host)
		}

		export const relation = (r: Entity.Relation): MegalodonEntity.Relationship => {
			return {
				id: r.id,
				following: r.isFollowing,
				followed_by: r.isFollowed,
				blocking: r.isBlocking,
				blocked_by: r.isBlocked,
				muting: r.isMuted,
				muting_notifications: false,
				requested: r.hasPendingFollowRequestFromYou,
				domain_blocking: false,
				showing_reblogs: true,
				endorsed: false,
				notifying: false,
				note: ''
			}
		}

		export const choice = (c: Entity.Choice): MegalodonEntity.PollOption => {
			return {
				title: c.text,
				votes_count: c.votes
			}
		}

		export const poll = (p: Entity.Poll): MegalodonEntity.Poll => {
			const now = dayjs()
			const expire = dayjs(p.expiresAt)
			const count = p.choices.reduce((sum, choice) => sum + choice.votes, 0)
			return {
				id: '',
				expires_at: p.expiresAt,
				expired: now.isAfter(expire),
				multiple: p.multiple,
				votes_count: count,
				options: p.choices.map((c) => choice(c)),
				voted: p.choices.some((c) => c.isVoted)
			}
		}

		export const note = (n: Entity.Note, host: string): MegalodonEntity.Status => {
			host = host.replace('https://', '')
			const text = n.text
				? n.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#x60;').replace(/\r?\n/g, '<br>')
				: ''
			const html = autoLinker(text, host)
			const localEmojis = emojiExtractor(text, host).map((e) => emoji(e))
			return {
				id: n.id,
				uri: n.uri ? n.uri : `https://${host}/notes/${n.id}`,
				url: n.uri ? n.uri : `https://${host}/notes/${n.id}`,
				account: user(n.user, host),
				in_reply_to_id: n.replyId,
				in_reply_to_account_id: null,
				reblog: n.renote ? note(n.renote, host) : null,
				content: html,
				plain_content: n.text ? n.text : null,
				created_at: n.createdAt,
				edited_at: null,
				emojis: [...emojiConverter(n.emojis).map((e) => emoji(e)), ...localEmojis],
				replies_count: n.repliesCount,
				reblogs_count: n.renoteCount,
				favourites_count: 0,
				reblogged: false,
				favourited: !!n.myReaction,
				muted: false,
				sensitive: n.files ? n.files.some((f) => f.isSensitive) : false,
				spoiler_text: n.cw ? n.cw : '',
				visibility: visibility(n.visibility),
				media_attachments: n.files ? n.files.map((f) => file(f)) : [],
				mentions: [],
				tags: [],
				card: null,
				poll: n.poll ? poll(n.poll) : null,
				application: null,
				language: null,
				pinned: null,
				emoji_reactions: mapReactions(host, n.reactions, n.myReaction || '', n.reactionEmojis || {}),
				bookmarked: false,
				quote: !!(n.renote && n.text),
				quote_status: n.renote && n.text ? note(n.renote, host) : null
			}
		}
		export const mapReactions = (host: string, r: { [key: string]: number }, myReaction: string, emojiData: MisskeyEntity.Emoji[] | MisskeyEntity.EmojiKeyValue): Array<MegalodonEntity.Reaction> => {
			if (isEmojiArr(emojiData)) {
				return emojiData.map((e) => {
					return {
						count: 0,
						me: false,
						name: e.name,
						url: e.url,
						static_url: e.url
					}
				})
			}
			return Object.keys(r).map((key) => {
				const keyObj = key.replace(/:/g, '')
				const shortcode = key.replace(/[:@.]/g, '')
				const isCustomEmoji = shortcode !== key
				if (myReaction && key === myReaction) {
					return {
						count: r[key],
						me: true,
						name: shortcode,
						url: isCustomEmoji ? emojiData[keyObj] || `https://${host}/emoji/${shortcode}.webp` : undefined,
						static_url: isCustomEmoji ? emojiData[keyObj] || `https://${host}/emoji/${shortcode}.webp` : undefined
					}
				}
				return {
					count: r[key],
					me: false,
					name: shortcode,
					url: isCustomEmoji ? emojiData[keyObj] || `https://${host}/emoji/${shortcode}.webp` : undefined,
					static_url: isCustomEmoji ? emojiData[keyObj] || `https://${host}/emoji/${shortcode}.webp` : undefined
				}
			})
		}

		export const reactions = (r: Array<Entity.Reaction>, host: string, emojiData: MisskeyEntity.Emoji[] | MisskeyEntity.EmojiKeyValue): Array<MegalodonEntity.Reaction> => {
			const result: Array<MegalodonEntity.Reaction> = []
			if (isEmojiArr(emojiData)) {
				return emojiData.map((e) => {
					return {
						count: 0,
						me: false,
						name: e.name,
						url: e.url,
						static_url: e.url
					}
				})
			}
			for (const e of r) {
				const shortcode = e.type.replace(/[:@.]/g, '')
				const isCustomEmoji = shortcode !== e.type
				const i = result.findIndex((res) => res.name === e.type)
				if (i >= 0) {
					result[i].count++
				} else {
					result.push({
						count: 1,
						me: false,
						name: shortcode,
						url: isCustomEmoji ? emojiData[shortcode] || `https://${host}/emoji/${shortcode}.webp` : undefined,
						static_url: isCustomEmoji ? emojiData[shortcode] || `https://${host}/emoji/${shortcode}.webp` : undefined
					})
				}
			}
			return result
		}

		export const emojiExtractor = (text: string, host: string): MisskeyEntity.Emoji[] => {
			const r = text.match(/:([a-zA-Z0-9_+-]+):/g)
			if (!r) return []
			const unique = Array.from(new Set(r))
			return unique.map((u) => {
				const shortcode = u.replace(/:/g, '')
				return {
					name: shortcode,
					host: null,
					url: `https://${host}/emoji/${shortcode}.webp`,
					aliases: []
				}
			})
		}

		export const noteToConversation = (n: Entity.Note, host: string): MegalodonEntity.Conversation => {
			const accounts: Array<MegalodonEntity.Account> = [user(n.user, host)]
			if (n.reply) {
				accounts.push(user(n.reply.user, host))
			}
			return {
				id: n.id,
				accounts: accounts,
				last_status: note(n, host),
				unread: false
			}
		}

		export const list = (l: Entity.List): MegalodonEntity.List => ({
			id: l.id,
			title: l.name,
			replies_policy: null
		})

		export const encodeNotificationType = (e: MegalodonEntity.NotificationType): MisskeyEntity.NotificationType => {
			switch (e) {
				case NotificationType.Follow:
					return MisskeyNotificationType.Follow
				case NotificationType.Mention:
					return MisskeyNotificationType.Reply
				case NotificationType.Favourite:
				case NotificationType.Reaction:
					return MisskeyNotificationType.Reaction
				case NotificationType.Reblog:
					return MisskeyNotificationType.Renote
				case NotificationType.PollVote:
					return MisskeyNotificationType.PollVote
				case NotificationType.FollowRequest:
					return MisskeyNotificationType.ReceiveFollowRequest
				default:
					return e
			}
		}

		export const decodeNotificationType = (e: MisskeyEntity.NotificationType): MegalodonEntity.NotificationType => {
			switch (e) {
				case MisskeyNotificationType.Follow:
					return NotificationType.Follow
				case MisskeyNotificationType.Mention:
				case MisskeyNotificationType.Reply:
					return NotificationType.Mention
				case MisskeyNotificationType.Renote:
				case MisskeyNotificationType.Quote:
					return NotificationType.Reblog
				case MisskeyNotificationType.Reaction:
					return NotificationType.Reaction
				case MisskeyNotificationType.PollVote:
					return NotificationType.PollVote
				case MisskeyNotificationType.ReceiveFollowRequest:
					return NotificationType.FollowRequest
				case MisskeyNotificationType.FollowRequestAccepted:
					return NotificationType.Follow
				default:
					return e
			}
		}
		const modelOfAcct: MegalodonEntity.Account = {
			id: '1',
			username: 'none',
			acct: 'none',
			display_name: 'none',
			locked: true,
			bot: true,
			discoverable: false,
			group: false,
			created_at: '1971-01-01T00:00:00.000Z',
			note: '',
			url: 'https://http.cat/404',
			avatar: 'https://http.cat/404',
			avatar_static: 'https://http.cat/404',
			header: 'https://http.cat/404',
			header_static: 'https://http.cat/404',
			followers_count: -1,
			following_count: 0,
			statuses_count: 0,
			noindex: true,
			emojis: [],
			fields: [],
			moved: null,
			suspended: false,
			limited: false
		}

		export const notification = (n: Entity.Notification, host: string): MegalodonEntity.Notification => {
			let notification = {
				id: n.id,
				account: n.user ? user(n.user, host) : modelOfAcct,
				created_at: n.createdAt,
				type: decodeNotificationType(n.type)
			}
			if (n.note) {
				notification = Object.assign(notification, {
					status: note(n.note, host)
				})
			}
			if (n.reaction) {
				notification = Object.assign(notification, {
					emoji: n.reaction
				})
			}
			return notification
		}

		export const stats = (s: Entity.Stats): MegalodonEntity.Stats => {
			return {
				user_count: s.usersCount,
				status_count: s.notesCount,
				domain_count: s.instances
			}
		}

		export const meta = (m: Entity.Meta, s: Entity.Stats): MegalodonEntity.Instance => {
			const wss = m.uri.replace(/^https:\/\//, 'wss://')
			return {
				uri: m.uri,
				title: m.name,
				description: m.description,
				email: m.maintainerEmail,
				version: m.version,
				thumbnail: m.bannerUrl,
				urls: {
					streaming_api: `${wss}/streaming`
				},
				stats: stats(s),
				languages: m.langs,
				contact_account: undefined,
				registrations: !m.disableRegistration,
				approval_required: false,
				configuration: {
					statuses: {
						max_characters: m.maxNoteTextLength
					}
				}
			}
		}

		export const hashtag = (h: Entity.Hashtag): MegalodonEntity.Tag => {
			return {
				name: h.tag,
				url: h.tag,
				history: [],
				following: false
			}
		}
	}

	export const DEFAULT_SCOPE = [
		'read:account',
		'write:account',
		'read:blocks',
		'write:blocks',
		'read:drive',
		'write:drive',
		'read:favorites',
		'write:favorites',
		'read:following',
		'write:following',
		'read:mutes',
		'write:mutes',
		'write:notes',
		'read:notifications',
		'write:notifications',
		'read:reactions',
		'write:reactions',
		'write:votes'
	]

	/**
	 * Interface
	 */
	export interface Interface {
		post<T = any>(path: string, params?: any, headers?: { [key: string]: string }): Promise<Response<T>>
		cancel(): void
		socket(channel: 'user' | 'localTimeline' | 'hybridTimeline' | 'globalTimeline' | 'conversation' | 'list', listId?: string): WebSocket
	}

	/**
	 * Misskey API client.
	 *
	 * Usign axios for request, you will handle promises.
	 */
	export class Client implements Interface {
		private accessToken: string | null
		private baseUrl: string
		private userAgent: string
		private abortController: AbortController

		/**
		 * @param baseUrl hostname or base URL
		 * @param accessToken access token from OAuth2 authorization
		 * @param userAgent UserAgent is specified in header on request.
		 */
		constructor(baseUrl: string, accessToken: string | null, userAgent: string = DEFAULT_UA) {
			this.accessToken = accessToken
			this.baseUrl = baseUrl
			this.userAgent = userAgent
			this.abortController = new AbortController()
			axios.defaults.signal = this.abortController.signal
		}

		/**
		 * POST request to mastodon REST API.
		 * @param path relative path from baseUrl
		 * @param params Form data
		 * @param headers Request header object
		 */
		public async post<T>(path: string, params: any = {}, headers: { [key: string]: string } = {}): Promise<Response<T>> {
			const options: AxiosRequestConfig = {
				headers: headers,
				maxContentLength: Infinity,
				maxBodyLength: Infinity
			}
			let bodyParams = params
			if (this.accessToken) {
				if (params instanceof FormData) {
					bodyParams.set('limit', parseInt(bodyParams.get('limit'), 10))
					bodyParams.append('i', this.accessToken)
				} else {
					params.limit = parseInt(params.limit, 10)
					bodyParams = Object.assign(params, {
						i: this.accessToken
					})
				}
			}
			return axios.post<T>(this.baseUrl + path, bodyParams, options).then((resp: AxiosResponse<T>) => {
				const res: Response<T> = {
					data: resp.data,
					status: resp.status,
					statusText: resp.statusText,
					headers: resp.headers
				}
				return res
			})
		}

		/**
		 * Cancel all requests in this instance.
		 * @returns void
		 */
		public cancel() {
			return this.abortController.abort()
		}

		/**
		 * Get connection and receive websocket connection for Misskey API.
		 *
		 * @param channel Channel name is user, localTimeline, hybridTimeline, globalTimeline, conversation or list.
		 * @param listId This parameter is required only list channel.
		 */
		public socket(channel: 'user' | 'localTimeline' | 'hybridTimeline' | 'globalTimeline' | 'conversation' | 'list', listId?: string): WebSocket {
			if (!this.accessToken) {
				throw new Error('accessToken is required')
			}
			const url = this.baseUrl.replace('https://', 'wss://') + '/streaming'
			const streaming = new WebSocket(url, channel, this.accessToken, listId, this.userAgent)
			if (!isBrowser()) {
				process.nextTick(() => {
					streaming.start()
				})
			} else {
				setTimeout(() => {
					streaming.start()
				}, 0)
			}
			return streaming
		}
	}
}

export default MisskeyAPI
