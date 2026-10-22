import type { CourseApiItem } from '@/types/course-api'
import type { UserRole } from './User'

// GET /users/:id/public — self-declared text + verified doctor credentials.
// Never carries email or licence identifiers.
export interface PublicProfile {
  id: string
  fullName: string
  avatar: string | null
  role: UserRole
  headline: string | null
  bio: string | null
  verification: {
    academicTitle: string | null
    workplace: string | null
    scopeOfPractice: string
  } | null
  courses: CourseApiItem[]
}
