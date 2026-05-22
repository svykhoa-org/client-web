import type { Attachment } from './Attachment'
import type { BaseModel } from './BaseModel'
import type { Category } from './Category'
import type { Author } from './User'

export enum PostStatus {
  Draft = 'draft',
  Published = 'published',
  PendingReview = 'pending_review',
  Rejected = 'rejected',
  Archived = 'archived',
}

export interface Post extends BaseModel {
  title: string
  content: string
  tags: string[]
  isPinned?: boolean
  commentCount?: number
  viewCount?: number
  status?: PostStatus

  authorId: string
  categoryId: string
  attachmentIds?: string[]

  // Handle optional relationships
  author?: Author
  category?: Category
  attachments?: Attachment[]
}
