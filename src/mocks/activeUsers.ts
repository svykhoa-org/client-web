import type { User } from '@/models/User'
import { UserRole, UserStatus } from '@/models/User'

export interface ActiveUser extends User {
  activity?: {
    postCount: number
    commentCount: number
    likeCount: number
    lastActive: string
    responseRate?: number
    helpfulVotes?: number
    streak?: number
    badgeCount?: number
  }
}

export const activeUsers: ActiveUser[] = [
  {
    id: 'user1',
    fullName: 'Nguyễn Thanh Hà',
    email: 'thanh.ha@example.com',
    role: UserRole.User,
    status: UserStatus.Active,
    avatarUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
    bio: 'Người mẹ quan tâm đến dinh dưỡng và chăm sóc trẻ em',
    createdAt: new Date('2022-03-15').toISOString(),
    updatedAt: new Date('2023-12-10').toISOString(),
    activity: {
      postCount: 87,
      commentCount: 453,
      likeCount: 712,
      lastActive: new Date('2025-07-02T15:30:00').toISOString(),
      responseRate: 98,
      helpfulVotes: 351,
      streak: 45,
      badgeCount: 8,
    },
  },
  {
    id: 'user2',
    fullName: 'Trần Minh Tuấn',
    email: 'tuan.tm@example.com',
    role: UserRole.User,
    status: UserStatus.Active,
    avatarUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
    bio: 'Người bệnh tiểu đường type 2, chia sẻ kinh nghiệm kiểm soát đường huyết',
    createdAt: new Date('2021-08-22').toISOString(),
    updatedAt: new Date('2023-11-05').toISOString(),
    activity: {
      postCount: 62,
      commentCount: 385,
      likeCount: 529,
      lastActive: new Date('2025-07-02T18:45:00').toISOString(),
      responseRate: 94,
      helpfulVotes: 287,
      streak: 32,
      badgeCount: 6,
    },
  },
  {
    id: 'user3',
    fullName: 'Lê Thị Hương',
    email: 'huong.lt@example.com',
    role: UserRole.User,
    status: UserStatus.Active,
    avatarUrl: 'https://randomuser.me/api/portraits/women/57.jpg',
    bio: 'Y tá đã nghỉ hưu, thích chia sẻ kinh nghiệm chăm sóc sức khỏe tại nhà',
    createdAt: new Date('2020-11-30').toISOString(),
    updatedAt: new Date('2023-09-18').toISOString(),
    activity: {
      postCount: 124,
      commentCount: 612,
      likeCount: 843,
      lastActive: new Date('2025-07-03T08:15:00').toISOString(),
      responseRate: 99,
      helpfulVotes: 475,
      streak: 78,
      badgeCount: 11,
    },
  },
  {
    id: 'user4',
    fullName: 'Phạm Văn Nam',
    email: 'nam.pv@example.com',
    role: UserRole.User,
    status: UserStatus.Active,
    avatarUrl: 'https://randomuser.me/api/portraits/men/29.jpg',
    bio: 'Người tập gym 10 năm, có kiến thức về dinh dưỡng thể thao',
    createdAt: new Date('2022-01-05').toISOString(),
    updatedAt: new Date('2023-12-25').toISOString(),
    activity: {
      postCount: 48,
      commentCount: 251,
      likeCount: 392,
      lastActive: new Date('2025-07-02T21:10:00').toISOString(),
      responseRate: 87,
      helpfulVotes: 178,
      streak: 21,
      badgeCount: 5,
    },
  },
  {
    id: 'user5',
    fullName: 'Hoàng Thị Lan',
    email: 'lan.ht@example.com',
    role: UserRole.User,
    status: UserStatus.Active,
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Chuyên viên dinh dưỡng, tư vấn chế độ ăn cho người mắc bệnh mãn tính',
    createdAt: new Date('2021-04-18').toISOString(),
    updatedAt: new Date('2023-10-30').toISOString(),
    activity: {
      postCount: 93,
      commentCount: 417,
      likeCount: 685,
      lastActive: new Date('2025-07-03T09:25:00').toISOString(),
      responseRate: 96,
      helpfulVotes: 322,
      streak: 42,
      badgeCount: 9,
    },
  },
  {
    id: 'user6',
    fullName: 'Vũ Đình Thành',
    email: 'thanh.vd@example.com',
    role: UserRole.User,
    status: UserStatus.Active,
    avatarUrl: 'https://randomuser.me/api/portraits/men/53.jpg',
    bio: 'Người khỏi bệnh ung thư phổi, chia sẻ hành trình điều trị và phục hồi',
    createdAt: new Date('2020-09-12').toISOString(),
    updatedAt: new Date('2023-11-20').toISOString(),
    activity: {
      postCount: 37,
      commentCount: 291,
      likeCount: 548,
      lastActive: new Date('2025-07-02T17:55:00').toISOString(),
      responseRate: 92,
      helpfulVotes: 263,
      streak: 15,
      badgeCount: 7,
    },
  },
]
