import type { BaseModel } from './BaseModel'

// ── Enums ─────────────────────────────────────────────────────────────────────

export enum PhysicalCertificateStatus {
  NONE = 'none',
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

// ── Embedded types ────────────────────────────────────────────────────────────

export interface PhysicalAddress {
  name: string
  phone: string
  street: string
  city: string
  province: string
}

// ── Certificate ───────────────────────────────────────────────────────────────

export interface Certificate extends BaseModel {
  enrollmentId: string
  userId: string
  courseId: string

  /** Mã chứng chỉ duy nhất (in lên văn bằng). */
  certificateCode: string

  /** Snapshot thông tin khoá học tại thời điểm cấp chứng chỉ. */
  courseSnapshot: Record<string, unknown>

  issuedAt: string

  /** URL file chứng chỉ điện tử (PDF/image). */
  digitalUrl: string | null

  physicalStatus: PhysicalCertificateStatus
  physicalAddress: PhysicalAddress | null
  physicalRequestedAt: string | null
  physicalShippedAt: string | null
}
