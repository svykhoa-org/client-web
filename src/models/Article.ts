import type { ArticleCategory } from './ArticleCategory'
import type { BaseModel } from './BaseModel'
import type { User } from './User'

export interface Article extends BaseModel {
  title: string
  slug: string
  summary: string
  content: string
  thumbnail: string
  author: User
  category: ArticleCategory
  viewCount: number
}
