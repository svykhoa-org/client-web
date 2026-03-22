import type Module from 'module';

import type { BaseModel } from './BaseModel';

export enum LessonContentType {
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}
export enum LessonStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  UPLOADING = 'UPLOADING',
}

export interface Lesson extends BaseModel {
  title: string;
  contentType: LessonContentType;
  contentKey: string | null;
  status: LessonStatus;

  // Relations
  moduleId: string;
  module?: Module;
}
