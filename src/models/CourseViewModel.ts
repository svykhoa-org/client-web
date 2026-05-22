export interface CourseVM {
  id: string
  title: string
  description: string
  instructor: {
    id: string
    fullName: string
    avatarUrl?: string
    title?: string
  }
  modules: Array<{
    id: string
    title: string
    lessons: Array<{
      id: string
      title: string
      durationSec: number
      video: {
        hlsUrl?: string
        mp4Url?: string
        posterUrl?: string
      }
      resources?: Array<{
        name: string
        url: string
        mime?: string
        isPaidOnly?: boolean
      }>
    }>
  }>
  metadata: {
    level: string
    categories: string[]
    totalDuration: number // minutes
    enrollCount: number
    ratingAvg: number
    ratingCount: number
  }
}

export type LessonProgress = {
  lessonId: string
  watchedDuration: number // seconds
  totalDuration: number
  isCompleted: boolean
  lastWatchedAt: Date
}

export type CourseProgress = {
  courseId: string
  lessons: Record<string, LessonProgress>
  overallProgress: number // 0-100%
}
