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

export interface WatchTimeResponse {
  progress: LessonProgressApi
  unlockedLessonId: string | null
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

// ── Quiz ──────────────────────────────────────────────────────────────────────

/** Question type discriminator */
export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'short_answer'

/** Status of a quiz attempt */
export type QuizAttemptStatus = 'in_progress' | 'submitted'

/** One selectable option within a question — isCorrect is never sent to learners */
export interface QuizOption {
  id: string
  content: string
  order: number
}

/** A quiz question as returned to learners (correctness stripped) */
export interface QuizQuestion {
  id: string
  content: string
  type: QuestionType
  order: number
  points: number
  options: QuizOption[] // isCorrect is stripped — never sent to client
}

/** Returned by GET /quizzes/:id/take */
export interface QuizApi {
  id: string
  title: string
  passingScore: number       // 0-100 percentage
  maxAttempts: number | null // null = unlimited
  timeLimit: number | null   // minutes, null = no limit
  questions: QuizQuestion[]
}

/** Returned by POST /quizzes/:id/start */
export interface StartQuizResult {
  attemptId: string
  attemptNumber: number
  startedAt: string       // ISO date string
  expiresAt: string | null // ISO date string, null when no timeLimit
}

/** One answer entry in a quiz submission */
export interface SubmitAnswerPayload {
  questionId: string
  selectedOptionIds?: string[]
  textAnswer?: string
}

/** Payload for POST /quizzes/:id/attempts/:attemptId/submit */
export interface SubmitQuizPayload {
  answers: SubmitAnswerPayload[]
}

/** Option entry stored in the submission snapshot (includes isCorrect for review) */
export interface SnapshotOption {
  id: string
  content: string
  order: number
  isCorrect: boolean
}

/** Full snapshot of one question's answer stored immutably in a QuizAttempt */
export interface SnapshotAnswerRecord {
  questionId: string
  questionContent: string
  questionType: QuestionType
  maxPoints: number
  allOptions: SnapshotOption[]
  selectedOptionIds: string[] | null
  textAnswer: string | null
  isCorrect: boolean
  pointsEarned: number
}

/** Returned by POST /quizzes/:id/attempts/:attemptId/submit */
export interface QuizSubmitResult {
  attemptId: string
  attemptNumber: number
  score: number       // 0-100
  isPassed: boolean
  totalPoints: number
  earnedPoints: number
  answers: SnapshotAnswerRecord[]
}

/** Returned by GET /quizzes/:id/my-attempts (one item) */
export interface QuizAttemptApi {
  id: string
  quizId: string
  userId: string
  attemptNumber: number
  status: QuizAttemptStatus
  score: number
  isPassed: boolean
  startedAt: string
  submittedAt: string | null
  answers: SnapshotAnswerRecord[] | null
}
