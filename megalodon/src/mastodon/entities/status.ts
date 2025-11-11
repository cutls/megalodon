import type { Account } from './account.js'
import type { Application } from './application.js'
import type { Attachment } from './attachment.js'
import type { Mention } from './mention.js'
import type { Emoji } from './emoji.js'
import type { Card } from './card.js'
import type { Poll } from './poll.js'

export type Status = {
	id: string
	uri: string
	url: string
	account: Account
	in_reply_to_id: string | null
	in_reply_to_account_id: string | null
	reblog: Status | null
	content: string
	created_at: string
	edited_at: string | null
	emojis: Emoji[]
	replies_count: number
	reblogs_count: number
	favourites_count: number
	reblogged: boolean | null
	favourited: boolean | null
	muted: boolean | null
	sensitive: boolean
	spoiler_text: string
	visibility: StatusVisibility
	media_attachments: Array<Attachment>
	mentions: Array<Mention>
	tags: Array<StatusTag>
	card: Card | null
	poll: Poll | null
	application: Application | null
	language: string | null
	pinned: boolean | null
	bookmarked?: boolean
	// 4.5.0
	quotes_count?: number
	quote?: {
		quoted_status: Status | null
		state: QuoteState
	}
	quote_approval?: QuoteApproval
	// These parameters are unique parameters in fedibird.com for quote.
	quote_id?: string
	emoji_reactioned?: boolean
	emoji_reactions?: Array<Reaction>
	emoji_reactions_count?: number
}
type QuoteState1 = 'pending' | 'accepted' | 'rejected' | 'revoked' | 'deleted'
type QuoteState2 = 'unauthorized' | 'blocked_account' | 'blocked_domain' | 'muted_account'
type QuoteState = QuoteState1 | QuoteState2
type QuoteApprovalPolicy = 'public' | 'followers' | 'following' | 'unsupported_policy'
export type QuoteApproval = {
	automatic: QuoteApprovalPolicy[]
	manual: QuoteApprovalPolicy[]
	current_user: 'automatic' | 'manual' | 'denied' | 'unknown'
}

export type Reaction = {
	name: string
	count: number
	account_ids: Array<string>
	me: boolean
}

export type StatusTag = {
	name: string
	url: string
}

export type StatusVisibility = 'public' | 'unlisted' | 'private' | 'direct'
