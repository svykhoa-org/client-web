import type { TagProps } from 'antd'

import type { BaseModel } from './BaseModel'
import type { CourseModule } from './Module'

// ── Enums (mirrors BE CourseStatus enum) ─────────────────────────────────────

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export const CourseStatusLabel: Record<CourseStatus, string> = {
  [CourseStatus.DRAFT]: 'Bản nháp',
  [CourseStatus.PUBLISHED]: 'Đã xuất bản',
  [CourseStatus.ARCHIVED]: 'Đã lưu trữ',
}

export const CourseStatusColor: Record<CourseStatus, TagProps['color']> = {
  [CourseStatus.DRAFT]: 'default',
  [CourseStatus.PUBLISHED]: 'success',
  [CourseStatus.ARCHIVED]: 'error',
}

// Need add: CourseLevel (BE chưa có field level cho khoá học)
// export enum CourseLevel { BEGINNER = 'beginner', INTERMEDIATE = 'intermediate', ADVANCED = 'advanced' }

// ── Embedded types ────────────────────────────────────────────────────────────

/**
 * Tags được lưu dạng JSONB snapshot trực tiếp trong course (không phải relation đầy đủ).
 * Nếu cần slug/description → query riêng tới /course-tags/:id.
 */
export interface CourseTagSnapshot {
  id: string
  name: string
  color: string | null
}

/**
 * Category được trả về qua relation ManyToOne từ CourseCategory entity.
 */
export interface CourseCategory extends BaseModel {
  name: string
  description: string | null
  slug: string
  icon: string | null
  parentId: string | null
  path: string | null
  publishedCourseCount: number
  totalCourseCount: number
}

/**
 * Tiêu chí hoàn thành khoá học (cấu trúc cụ thể do BE định nghĩa khi implement).
 */
export interface CompletionCriteria {
  [key: string]: unknown
}

// ── Course ───────────────────────────────────────────────────────────────────

export interface Course extends BaseModel {
  title: string
  subTitle: string | null
  description: string | null

  // Taxonomy
  categoryId: string | null
  category: CourseCategory | null
  tags: CourseTagSnapshot[] | null

  // Media
  thumbnail: string | null

  // Pricing
  price: number

  // Identifier
  shortCode: string

  // Status
  status: CourseStatus

  // Schedule
  startDate: string | null
  endDate: string | null
  registrationStart: string | null
  registrationEnd: string | null

  // Enrollment limits
  maxEnrollments: number | null
  currentEnrollments: number

  // Learning settings
  selfPaced: boolean
  accessDurationDays: number | null

  // Content metadata
  objectives: string[]
  requirements: string[]
  suitableFor: string[]
  instructorIds: string[]

  // Duration
  totalDurationMinutes: number | null

  // CME / certification
  cmeCredits: number | null
  certifyingOrganization: string | null

  // Completion criteria (JSONB, structure TBD)
  completionCriteria: CompletionCriteria | null

  // Need add: slug (BE chưa có slug cho course, hiện dùng shortCode làm định danh)
  // slug: string

  // Need add: level (BE chưa có trình độ khoá học)
  // level: CourseLevel

  // Need add: averageRating (BE chưa có hệ thống rating)
  // averageRating: number

  // Need add: reviewCount (BE chưa có hệ thống review)
  // reviewCount: number

  // Need add: instructorName / instructorBio / instructorAvatar
  // (hiện chỉ lưu instructorIds, cần query riêng tới /users/:id)
  // instructorName: string | null
  // instructorBio: string | null
  // instructorAvatar: string | null

  // Relations (optional — chỉ có khi API trả về eager load)
  modules?: CourseModule[]
}
