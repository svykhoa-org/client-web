import type { BaseModel } from './BaseModel'

// ── Enums (mirrors BE LessonType enum) ───────────────────────────────────────

export enum LessonType {
  VIDEO = 'video',
  DOCUMENT = 'document',
  QUIZ = 'quiz',
}

// ── Lesson ───────────────────────────────────────────────────────────────────

export interface Lesson extends BaseModel {
  moduleId: string
  courseId: string
  title: string
  description: string | null
  order: number
  type: LessonType

  /** ID tham chiếu tới video/document/quiz entity tương ứng. */
  contentId: string | null

  /**
   * Nội dung chi tiết dạng JSONB (lấy từ object storage hoặc quiz content).
   * Cấu trúc thay đổi tuỳ theo `type`.
   */
  content: Record<string, unknown> | null

  /** Thời gian học ước tính (phút). */
  durationMinutes: number

  /** Bài học bắt buộc phải hoàn thành. */
  isRequired: boolean

  /** Cho phép xem thử trước khi mua khoá học. */
  isPreview: boolean

  /**
   * Bài học điều kiện — bài này bị khoá cho đến khi hoàn thành bài điều kiện.
   * Chỉ áp dụng khi Course.selfPaced = false.
   */
  prerequisiteLessonId: string | null

  // Need add: streamUrl (BE chưa trả về URL stream video trực tiếp qua REST)
  // streamUrl: string | null
}

/** @deprecated Dùng Lesson thay thế */
export type { Lesson as default }
