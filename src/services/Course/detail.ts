import type { CourseApiItem } from '@/types/course-api'

import { httpClient } from '../apiClient'

export async function getCourseById(id: string): Promise<CourseApiItem> {
  const response = await httpClient.get<CourseApiItem>(`/courses/${id}`)

  return response.data as CourseApiItem
}
