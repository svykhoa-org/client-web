import type { CourseAccessResponse } from '@/types/course-api'

import { httpClient } from '../apiClient'

export async function getCourseAccess(courseId: string): Promise<CourseAccessResponse> {
  const response = await httpClient.get<CourseAccessResponse>(
    `/lesson-progress/courses/${courseId}/access`,
  )
  return response.data as CourseAccessResponse
}
