import type { TagProps } from 'antd';

import type { BaseModel } from './BaseModel';
import type { Module } from './Module';

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}
export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export const CourseLevelLabel = {
  [CourseLevel.BEGINNER]: 'Cơ bản',
  [CourseLevel.INTERMEDIATE]: 'Trung cấp',
  [CourseLevel.ADVANCED]: 'Nâng cao',
};

export const CourseLevelColor: Record<CourseLevel, TagProps['color']> = {
  [CourseLevel.BEGINNER]: 'green',
  [CourseLevel.INTERMEDIATE]: 'orange',
  [CourseLevel.ADVANCED]: 'red',
};

export const CourseStatusLabel = {
  [CourseStatus.DRAFT]: 'Bản nháp',
  [CourseStatus.PUBLISHED]: 'Đã xuất bản',
  [CourseStatus.ARCHIVED]: 'Đã lưu trữ',
};

export const CourseStatusColor: Record<CourseStatus, TagProps['color']> = {
  [CourseStatus.DRAFT]: 'default',
  [CourseStatus.PUBLISHED]: 'success',
  [CourseStatus.ARCHIVED]: 'error',
};

export interface Course extends BaseModel {
  title: string;
  slug: string;
  thumbnail: string | null;
  description: string | null;
  status: CourseStatus;
  price: number;
  level: CourseLevel;
  duration: number; // minutes
  enrollmentCount: number;
  averageRating: number; // 0-100
  reviewCount: number;
  instructorName: string | null;
  instructorBio: string | null;
  instructorAvatar: string | null;
  modules?: Module[];
}
