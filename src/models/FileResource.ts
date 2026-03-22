import type { BaseModel } from '@/shared/interface/BaseModel';

export enum FileResourceMode {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface FileResource extends BaseModel {
  mode: FileResourceMode;
}
