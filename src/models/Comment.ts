import type { Attachment } from './Attachment'
import type { BaseModel } from './BaseModel'
import type { Author } from './User'

export interface Comment extends BaseModel {
  postId: string
  content: string
  authorId: string

  parentId?: string
  attachmentIds?: string[]
  isEdited?: boolean

  // Handle optional relationships
  author?: Author
  attachments?: Attachment[]
}
