import type { StatusParams } from './status_params.js'
import type { Attachment } from './attachment.js'

export type ScheduledStatus = {
	id: string
	scheduled_at: string
	params: StatusParams
	media_attachments: Array<Attachment> | null
}
