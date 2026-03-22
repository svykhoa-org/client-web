import type { BaseModel } from './BaseModel';

export interface ArticleCategory extends BaseModel {
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  parentId?: string;
  isActive?: boolean;
}
