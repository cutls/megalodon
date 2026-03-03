import { Poll } from "./poll.js"
import { User } from "./user.js"
import { Emoji, EmojiKeyValue } from "./emoji.js"
import { File } from "./file.js"

  export type Note = {
    id: string
    createdAt: string
    userId: string
    user: User
    text: string | null
    cw: string | null
    visibility: 'public' | 'home' | 'followers' | 'specified'
    renoteCount: number
    repliesCount: number
    reactions: { [key: string]: number }
    emojis: Array<Emoji> | EmojiKeyValue
    fileIds: Array<string>
    files: Array<File>
    replyId: string | null
    renoteId: string | null
    uri?: string
    reply?: Note
    renote?: Note
    viaMobile?: boolean
    tags?: Array<string>
    poll?: Poll
    mentions?: Array<string>
    myReaction?: string,
    reactionEmojis?: EmojiKeyValue
    _integrated_isLocal?: boolean
  }
