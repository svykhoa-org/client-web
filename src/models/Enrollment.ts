import type { BaseModel } from './BaseModel';

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}
export enum EnrollmentSource {
  DIRECT = 'DIRECT',
  PURCHASE = 'PURCHASE',
  GIFT = 'GIFT',
  ADMIN = 'ADMIN',
}

/**
 * Model dùng cho việc quản lý đăng ký khóa học của user
 */
export interface Enrollment extends BaseModel {
  userId: string;
  courseId: string;
  orderId?: string;
  status: EnrollmentStatus;
  source: EnrollmentSource;
  paidAmount: number;
  paidAt?: string;
  expiresAt?: string;
}
