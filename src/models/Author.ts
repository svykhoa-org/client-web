import type { BaseModel } from './BaseModel'

export interface Author extends BaseModel {
  name: string
  avatarUrl?: string
}
