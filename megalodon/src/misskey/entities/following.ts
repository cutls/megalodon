import { UserDetail } from './userDetail.js'

export type Following = {
  id: string
  createdAt: string
  followeeId: string
  followerId: string
  followee: UserDetail
}
