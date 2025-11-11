import type * as account from './entities/account.js'
import type * as activity from './entities/activity.js'
import type * as announcement from './entities/announcement.js'
import type * as application from './entities/application.js'
import type * as async_attachment from './entities/async_attachment.js'
import type * as attachment from './entities/attachment.js'
import type * as card from './entities/card.js'
import type * as context from './entities/context.js'
import type * as conversation from './entities/conversation.js'
import type * as emoji from './entities/emoji.js'
import type * as featured_tag from './entities/featured_tag.js'
import type * as field from './entities/field.js'
import type * as filter from './entities/filter.js'
import type * as follow_request from './entities/follow_request.js'
import type * as history from './entities/history.js'
import type * as identity_proof from './entities/identity_proof.js'
import type * as instance from './entities/instance.js'
import type * as list from './entities/list.js'
import type * as marker from './entities/marker.js'
import type * as mention from './entities/mention.js'
import type * as notification from './entities/notification.js'
import type * as poll from './entities/poll.js'
import type * as preferences from './entities/preferences.js'
import type * as push_subscription from './entities/push_subscription.js'
import type * as reaction from './entities/reaction.js'
import type * as relationship from './entities/relationship.js'
import type * as report from './entities/report.js'
import type * as results from './entities/results.js'
import type * as role from './entities/role.js'
import type * as scheduled_status from './entities/scheduled_status.js'
import type * as source from './entities/source.js'
import type * as stats from './entities/stats.js'
import type * as status from './entities/status.js'
import type * as status_params from './entities/status_params.js'
import type * as status_source from './entities/status_source.js'
import type * as tag from './entities/tag.js'
import type * as token from './entities/token.js'
import type * as urls from './entities/urls.js'

export namespace Entity {
	export type Account = account.Account
	export type Activity = activity.Activity
	export type Announcement = announcement.Announcement
	export type AnnouncementAccount = announcement.AnnouncementAccount
	export type AnnouncementStatus = announcement.AnnouncementStatus
	export type AnnouncementReaction = announcement.AnnouncementReaction
	export type Application = application.Application
	export type AsyncAttachment = async_attachment.AsyncAttachment
	export type Attachment = attachment.Attachment
	export type Sub = attachment.Sub
	export type Focus = attachment.Focus
	export type Meta = attachment.Meta
	export type Card = card.Card
	export type Context = context.Context
	export type Conversation = conversation.Conversation
	export type Emoji = emoji.Emoji
	export type FeaturedTag = featured_tag.FeaturedTag
	export type Field = field.Field
	export type Filter = filter.Filter
	export type FilterContext = filter.FilterContext
	export type FollowRequest = follow_request.FollowRequest
	export type History = history.History
	export type IdentityProof = identity_proof.IdentityProof
	export type Instance = instance.Instance
	export type InstanceRule = instance.InstanceRule
	export type List = list.List
	export type RepliesPolicy = list.RepliesPolicy
	export type Marker = marker.Marker
	export type Mention = mention.Mention
	export type Notification = notification.Notification
	export type NotificationType = notification.NotificationType
	export type Poll = poll.Poll
	export type PollOption = poll.PollOption
	export type Preferences = preferences.Preferences
	export type Alerts = push_subscription.Alerts
	export type PushSubscription = push_subscription.PushSubscription
	export type Reaction = reaction.Reaction
	export type Relationship = relationship.Relationship
	export type Report = report.Report
	export type Category = report.Category
	export type Results = results.Results
	export type Role = role.Role
	export type ScheduledStatus = scheduled_status.ScheduledStatus
	export type Source = source.Source
	export type Stats = stats.Stats
	export type Status = status.Status
	export type StatusVisibility = status.StatusVisibility
	export type StatusTag = status.StatusTag
	export type StatusParams = status_params.StatusParams
	export type StatusSource = status_source.StatusSource
	export type Tag = tag.Tag
	export type Token = token.Token
	export type URLs = urls.URLs
}

export default Entity
