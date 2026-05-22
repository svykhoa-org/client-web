import type { BaseModel } from './BaseModel'

// FIXME: ĐỔi thành uppercase
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Mod = 'mod',
}

// FIXME: ĐỔi thành uppercase
export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Banned = 'banned',
}

export interface UserStats {
  postCount?: number
  followerCount?: number
  viewCount?: number
  rating?: number
}

export interface User extends BaseModel {
  fullName: string
  email: string
  role?: UserRole
  status?: UserStatus
  avatarUrl?: string
  bio?: string
  stats?: UserStats
  specialization?: string
  certificates?: string[]
  workplaces?: string[]
}

export interface Author {
  _id: string
  fullName: string
  avatarUrl?: string
}
