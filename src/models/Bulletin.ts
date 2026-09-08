import type { BaseModel } from './BaseModel'

export enum BulletinImportance {
  NORMAL = 'NORMAL',
  URGENT = 'URGENT',
}

export interface BulletinCategoryRef {
  id: string
  name: string
  slug: string
  color?: string | null
}

export interface BulletinAttachmentRef {
  id: string
  assetId: string
  url: string | null
  originalName: string | null
  mimetype: string | null
  size: number | null
  sortOrder: number
}

export interface Bulletin extends BaseModel {
  title: string
  summary?: string | null
  content: string
  slug: string

  publishedAt?: string | null
  thumbnail?: string | null

  categoryId?: string | null
  category?: BulletinCategoryRef | null

  importance: BulletinImportance
  pinnedUntil?: string | null
  expiresAt?: string | null

  isFeatured: boolean
  featuredRank?: number | null

  viewCount: number
  attachments?: BulletinAttachmentRef[]
}
