// src/models/Enrollment.ts
export type EnrollmentStatus = 'active' | 'completed' | 'expired' | 'refunded'

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  orderId: string | null
  status: EnrollmentStatus
  progress: number
  enrolledAt: string
  expireAt: string | null
  completedAt: string | null
  refundedAt: string | null
  pricePaid: number
  createdAt: string
  updatedAt: string
}
