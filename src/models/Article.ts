import type { BaseModel } from './BaseModel'

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface ArticleCategoryRef {
  id: string
  name: string
  slug: string
  color?: string | null
}

export interface ArticleUserRef {
  id: string
  fullName?: string
  avatarUrl?: string | null
}

export interface Article extends BaseModel {
  title: string
  summary: string
  content: string
  slug: string
  wordCount?: number | null

  status: ArticleStatus
  publishedAt?: string | null

  // Serialized public url of the cover asset (null when none).
  thumbnail?: string | null

  categoryId?: string | null
  category?: ArticleCategoryRef | null

  authorUserId?: string | null
  authorName: string
  authorTitle?: string | null
  authorAvatarUrl?: string | null

  reviewedByUserId?: string | null
  reviewedByUser?: ArticleUserRef | null
  reviewedAt?: string | null

  isFeatured: boolean
  featuredRank?: number | null

  metaTitle?: string | null
  metaDescription?: string | null
  canonicalUrl?: string | null
  ogImage?: string | null

  viewCount: number
}
