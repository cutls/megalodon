import type * as app from './entities/app.js'
import type * as blocking from './entities/blocking.js'
import type * as createdNote from './entities/createdNote.js'
import type * as emoji from './entities/emoji.js'
import type * as favorite from './entities/favorite.js'
import type * as file from './entities/file.js'
import type * as follower from './entities/follower.js'
import type * as following from './entities/following.js'
import type * as followRequest from './entities/followRequest.js'
import type * as hashtag from './entities/hashtag.js'
import type * as list from './entities/list.js'
import type * as meta from './entities/meta.js'
import type * as mute from './entities/mute.js'
import type * as note from './entities/note.js'
import type * as notification from './entities/notification.js'
import type * as poll from './entities/poll.js'
import type * as reaction from './entities/reaction.js'
import type * as relation from './entities/relation.js'
import type * as user from './entities/user.js'
import type * as userDetail from './entities/userDetail.js'
import type * as userkey from './entities/userkey.js'
import type * as session from './entities/session.js'
import type * as stats from './entities/stats.js'

export namespace Entity {
	export type App = app.App
	export type Blocking = blocking.Blocking
	export type CreatedNote = createdNote.CreatedNote
	export type Emoji = emoji.Emoji
	export type EmojiKeyValue = emoji.EmojiKeyValue
	export type Favorite = favorite.Favorite
	export type File = file.File
	export type Follower = follower.Follower
	export type Following = following.Following
	export type FollowRequest = followRequest.FollowRequest
	export type Hashtag = hashtag.Hashtag
	export type List = list.List
	export type Meta = meta.Meta
	export type Mute = mute.Mute
	export type Note = note.Note
	export type Notification = notification.Notification
	export type NotificationType = notification.NotificationType
	export type Poll = poll.Poll
	export type Choice = poll.Choice
	export type Reaction = reaction.Reaction
	export type Relation = relation.Relation
	export type User = user.User
	export type UserDetail = userDetail.UserDetail
	export type UserKey = userkey.UserKey
	export type Session = session.Session
	export type Stats = stats.Stats
}
export default Entity
