import type { BaseModel } from './BaseModel';

export interface Category extends BaseModel {
  name: string;
  description?: string;
  slug: string;
}
