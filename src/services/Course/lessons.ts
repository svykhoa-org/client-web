import type { CourseLesson } from '@/types/course-api'

import { httpClient } from '../apiClient'

export async function getModuleLessons(moduleId: string): Promise<CourseLesson[]> {
  const response = await httpClient.get<{ items: CourseLesson[]; pagination: unknown }>(
    `/modules/${moduleId}/lessons`,
    { 'sort[order]': 'ASC', limit: 200 },
  )

  return (response.data as { items: CourseLesson[]; pagination: unknown }).items
}
