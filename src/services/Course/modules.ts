import type { CourseModule } from '@/types/course-api'

import { httpClient } from '../apiClient'

export async function getCourseModules(courseId: string): Promise<CourseModule[]> {
  const response = await httpClient.get<{ items: CourseModule[]; pagination: unknown }>(
    `/courses/${courseId}/modules`,
    { 'sort[order]': 'ASC', limit: 100 },
  )

  return (response.data as { items: CourseModule[]; pagination: unknown }).items
}
