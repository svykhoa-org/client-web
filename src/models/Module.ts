import type { BaseModel } from './BaseModel'
import type { Lesson } from './Lesson'

// ── CourseModule ──────────────────────────────────────────────────────────────

export interface CourseModule extends BaseModel {
  courseId: string
  title: string
  description: string | null
  order: number

  /** Tổng thời gian học ước tính của module (phút). */
  totalDurationMinutes: number | null

  /**
   * Khoá module khi các module trước chưa hoàn thành.
   * Chỉ có tác dụng khi Course.selfPaced = false.
   */
  locked: boolean

  /** Số lượng bài học trong module (cached counter trên DB). */
  lessonCount: number

  // Relations (optional)
  lessons?: Lesson[]
}

/** @deprecated Dùng CourseModule thay thế */
export type Module = CourseModule
export type { CourseModule as default }
