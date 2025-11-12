export type List = {
  id: string
  createdAt: string
  name: string
  userIds: Array<string>
}
export type Antenna = {
  id: string
  createdAt: string
  name: string
  keywords: string[][]
  excludeKeywords: string[][]
  src: 'home' | 'all' | 'users' | 'list' | 'users_blacklist'
  userListId: string | null
  users: string[]
  caseSensitive: boolean
  localOnly: boolean
  excludeBots: boolean
  withReplies: boolean
  withFile: boolean
  excludeNotesInSensitiveChannel: boolean
  isActive: boolean
  hasUnreadNote: boolean
  notify: boolean
}
