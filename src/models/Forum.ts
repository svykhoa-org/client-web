import type { BaseModel } from './BaseModel'

export interface ForumPrefixTag extends BaseModel {
  name: string
  colorHex: string
}

export enum ThreadStatus {
  Pending = 'pending',
  Published = 'published',
  Hidden = 'hidden',
}

export enum ThreadSortOption {
  LastReply = 'last_reply',
  CreatedAt = 'created_at',
}

export interface ForumAuthor {
  id: string
  fullName: string
  avatar: string | null
}

export interface LatestThreadPreview {
  id: string
  title: string
  lastReplyAt: string | null
  lastReplyUser: { fullName: string; avatarUrl: string | null } | null
}

export interface SubCategoryWithPreview {
  id: string
  name: string
  description: string | null
  displayOrder: number
  threadCount: number
  messageCount: number
  latestThread: LatestThreadPreview | null
}

export interface ForumCategoryGroup {
  id: string
  name: string
  displayOrder: number
  subCategories: SubCategoryWithPreview[]
}

export interface ForumThread extends BaseModel {
  title: string
  content: string
  authorId: string
  author?: ForumAuthor
  subCategoryId: string
  prefixTagId: string | null
  prefixTag?: ForumPrefixTag | null
  isPinned: boolean
  isLocked: boolean
  viewCount: number
  status: ThreadStatus
  lastReplyAt: string | null
  lastReplyUserId: string | null
  lastReplyUser?: ForumAuthor | null
}
