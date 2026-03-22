import type { BaseModel } from './BaseModel';

export interface Author extends BaseModel {
  _id: string;
  name: string;
  avatarUrl?: string;
}
