import type { Account } from './account.js'
import type { Status } from './status.js'
import type { Reaction } from './reaction.js'

export type Notification = {
	account: Account | null
	created_at: string
	id: string
	status?: Status
	reaction?: Reaction
	type: NotificationType
	target?: Account
}

export type NotificationType = string
