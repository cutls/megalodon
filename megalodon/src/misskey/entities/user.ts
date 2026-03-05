import { Emoji, EmojiKeyValue } from './emoji.js'

export type User = {
  id: string
  name: string
  username: string
  host: string | null
  avatarUrl: string
  avatarColor: string
  emojis: Array<Emoji> | EmojiKeyValue
}
