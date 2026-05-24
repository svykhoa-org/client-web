// src/services/Enrollment/getMyEnrollment.ts
import axiosInstance from '@/lib/axios'
import type { Enrollment } from '@/models/Enrollment'

export async function getMyEnrollment(courseId: string): Promise<Enrollment | null> {
  try {
    const response = await axiosInstance.get<{
      statusCode: number
      message: string
      data: Enrollment
    }>(`/enrollments/my/${courseId}`)
    return response.data.data
  } catch (err: unknown) {
    // 404 means not enrolled — return null
    const status = (err as { response?: { status?: number } })?.response?.status
    if (status === 404) return null
    throw err
  }
}
