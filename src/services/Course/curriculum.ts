import type {
  CourseApiItem,
  CourseInstructor,
  CourseModuleWithLessons,
  PolicySummary,
} from '@/types/course-api'

import { httpClient } from '../apiClient'

export interface CourseCurriculum {
  course: CourseApiItem
  curriculum: CourseModuleWithLessons[]
  instructors: CourseInstructor[]
  policySummary: PolicySummary
}

export async function getCourseWithCurriculum(courseId: string): Promise<CourseCurriculum> {
  const response = await httpClient.get<CourseCurriculum>(`/courses/${courseId}/curriculum`)

  return response.data as CourseCurriculum
}
