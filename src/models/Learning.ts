import type { BaseModel } from './BaseModel'
import type { LessonStatus } from './enum'

export interface Enrollment extends BaseModel {
  userId: string
  courseId: string
  status: 'active' | 'expired' | 'revoked' // FE auto publish không nghĩa là auto enroll
  startedAt?: string
  expiresAt?: string
  orderId?: string // nếu miễn phí có thể undefined
}

export interface Progress extends BaseModel {
  userId: string
  courseId: string

  // Vì chỉ 1 video: track 1 bản ghi là đủ
  lessonProgress: {
    status: LessonStatus // not_started | in_progress | completed
    lastSecond?: number // time watched
    completedAt?: string // ISO
  }

  completedPercent: number // 0..100, dùng cho UI thanh tiến độ
  lastActivityAt?: string
}

// Cấp chứng chỉ PDF khi hoàn thành
export interface Certificate extends BaseModel {
  userId: string
  courseId: string
  serial: string // ví dụ: SVY-2025-APP-000123
  cmeCredits: number
  issuedAt: string
  expiresAt?: string
  pdfUrl: string
  checksum?: string // nếu muốn verify
}
