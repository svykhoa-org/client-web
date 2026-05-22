import type { BaseModel } from './BaseModel'

// ── Enums ─────────────────────────────────────────────────────────────────────

export enum LessonProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

// ── LessonProgress ────────────────────────────────────────────────────────────

export interface LessonProgress extends BaseModel {
  enrollmentId: string
  userId: string
  lessonId: string
  moduleId: string
  courseId: string
  status: LessonProgressStatus
  startedAt: string | null
  completedAt: string | null

  /** Dữ liệu tiến trình chi tiết (vị trí video, số câu đúng quiz, …). */
  progressData: Record<string, unknown> | null
}
