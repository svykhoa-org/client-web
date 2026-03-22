import type { Attachment } from './Attachment';
import type { BaseModel } from './BaseModel';

export interface Bulletin extends BaseModel {
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  attachment?: Attachment[];
}
