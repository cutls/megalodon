import type { UserDetail } from './userDetail.js'

export type Follower = {
	id: string
	createdAt: string
	followeeId: string
	followerId: string
	follower: UserDetail
}
