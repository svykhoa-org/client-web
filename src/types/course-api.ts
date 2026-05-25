// src/types/course-api.ts
export type CourseApiStatus = 'draft' | 'published' | 'archived'
export type LessonType = 'video' | 'document' | 'quiz'

export interface CourseCategory {
  id: string
  name: string
  slug: string
  icon: string | null
}

export interface CourseTag {
  id: string
  name: string
  color: string | null
}

export interface CourseApiItem {
  id: string
  title: string
  subTitle: string | null
  description: string | null
  thumbnail: string | null
  price: number
  shortCode: string
  status: CourseApiStatus
  selfPaced: boolean
  objectives: string[]
  requirements: string[]
  suitableFor: string[]
  instructorIds: string[]
  tags: CourseTag[] | null
  category: CourseCategory | null
  currentEnrollments: number
  maxEnrollments: number | null
  totalDurationMinutes: number | null
  accessDurationDays: number | null
  cmeCredits: number | null
  certifyingOrganization: string | null
  startDate: string | null
  endDate: string | null
  registrationStart: string | null
  registrationEnd: string | null
  createdAt: string
  updatedAt: string
}

export interface CourseModule {
  id: string
  courseId: string
  title: string
  description: string | null
  order: number
  lessonCount: number
  totalDurationMinutes: number | null
  locked: boolean
  createdAt: string
  updatedAt: string
}

export interface CourseLesson {
  id: string
  moduleId: string
  courseId: string
  title: string
  description: string | null
  order: number
  type: LessonType
  contentId: string | null
  durationMinutes: number
  isRequired: boolean
  isPreview: boolean
  prerequisiteLessonId: string | null
  createdAt: string
  updatedAt: string
}

export interface CourseModuleWithLessons extends CourseModule {
  lessons: CourseLesson[]
}

export interface CoursePaginationMeta {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface CourseListData {
  items: CourseApiItem[]
  pagination: CoursePaginationMeta
}

// ── LessonProgress API ────────────────────────────────────────────────────────

export interface LessonProgressApi {
  id: string
  enrollmentId: string
  userId: string
  lessonId: string
  moduleId: string
  courseId: string
  status: 'not_started' | 'in_progress' | 'completed'
  watchedSeconds: number
  startedAt: string | null
  completedAt: string | null
  progressData: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

// ── LessonLearning ────────────────────────────────────────────────────────────

export interface LessonPrerequisite {
  lessonId: string
  watchedPercent: number
}

export interface LessonLearningResponse {
  lesson: CourseLesson & {
    content?: Record<string, unknown> | null
    contentId?: string | null
  }
  progress: LessonProgressApi | null
  isAccessible: boolean
  prerequisite: LessonPrerequisite | null
}

// ── LessonNote ────────────────────────────────────────────────────────────────

export interface LessonNoteApi {
  id: string
  lessonId: string
  userId: string
  timestampSeconds: number | null
  contents: string[]
  isPinned: boolean
  pinnedAt: string | null
  createdAt: string
  updatedAt: string
}
