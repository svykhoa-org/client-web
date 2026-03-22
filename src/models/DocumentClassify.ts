import type { BaseModel } from '@/shared/interface/BaseModel';

export interface DocumentClassify extends BaseModel {
  name: string;
  slug: string;
  parentId?: string;
}
