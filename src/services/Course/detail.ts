import axiosInstance from '@/lib/axios'

import type { CourseApiItem } from '@/types/course-api'

export async function getCourseById(id: string): Promise<CourseApiItem> {
  const response = await axiosInstance.get<{
    statusCode: number
    message: string
    data: CourseApiItem
  }>(`/courses/${id}`)

  return response.data.data
}
