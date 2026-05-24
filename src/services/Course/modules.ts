import axiosInstance from '@/lib/axios'

import type { CourseModule } from '@/types/course-api'

export async function getCourseModules(courseId: string): Promise<CourseModule[]> {
  const response = await axiosInstance.get<{
    statusCode: number
    message: string
    data: {
      items: CourseModule[]
      pagination: unknown
    }
  }>(`/courses/${courseId}/modules`, {
    params: { 'sort[order]': 'ASC', limit: 100 },
  })

  return response.data.data.items
}
