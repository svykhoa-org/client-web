import type { CourseApiItem, CourseModuleWithLessons } from '@/types/course-api'

import axiosInstance from '@/lib/axios'

export interface CourseCurriculum {
  course: CourseApiItem
  curriculum: CourseModuleWithLessons[]
}

export async function getCourseWithCurriculum(courseId: string): Promise<CourseCurriculum> {
  const response = await axiosInstance.get<{
    statusCode: number
    message: string
    data: CourseCurriculum
  }>(`/courses/${courseId}/curriculum`)

  return response.data.data
}
