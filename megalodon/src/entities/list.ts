export type List = {
  id: string
  title: string
  replies_policy: RepliesPolicy | null
  is_misskey_antenna?: boolean
}

export type RepliesPolicy = 'followed' | 'list' | 'none'
