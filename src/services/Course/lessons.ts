import axiosInstance from '@/lib/axios'

import type { CourseLesson } from '@/types/course-api'

export async function getModuleLessons(moduleId: string): Promise<CourseLesson[]> {
  const response = await axiosInstance.get<{
    statusCode: number
    message: string
    data: {
      items: CourseLesson[]
      pagination: unknown
    }
  }>(`/modules/${moduleId}/lessons`, {
    params: { 'sort[order]': 'ASC', limit: 200 },
  })

  return response.data.data.items
}
