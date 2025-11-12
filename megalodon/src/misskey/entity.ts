import * as app from './entities/app.js'
import * as blocking from './entities/blocking.js'
import * as createdNote from './entities/createdNote.js'
import * as emoji from './entities/emoji.js'
import * as favorite from './entities/favorite.js'
import * as file from './entities/file.js'
import * as follower from './entities/follower.js'
import * as following from './entities/following.js'
import * as followRequest from './entities/followRequest.js'
import * as hashtag from './entities/hashtag.js'
import * as list from './entities/list.js'
import * as meta from './entities/meta.js'
import * as mute from './entities/mute.js'
import * as note from './entities/note.js'
import * as notification from './entities/notification.js'
import * as poll from './entities/poll.js'
import * as reaction from './entities/reaction.js'
import * as relation from './entities/relation.js'
import * as user from './entities/user.js'
import * as userDetail from './entities/userDetail.js'
import * as userkey from './entities/userkey.js'
import * as session from './entities/session.js'
import * as stats from './entities/stats.js'

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
  export type Antenna = list.Antenna
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
