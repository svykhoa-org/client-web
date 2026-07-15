// src/services/Enrollment/getMyEnrollment.ts
import type { Enrollment } from '@/models/Enrollment'

import { httpClient } from '../apiClient'
import { ApiError } from '../httpClient'

export async function getMyEnrollment(courseId: string): Promise<Enrollment | null> {
  try {
    const response = await httpClient.get<Enrollment>(`/enrollments/my/${courseId}`)
    return response.data as Enrollment
  } catch (err: unknown) {
    // 404 means not enrolled — return null. httpClient wraps failures as ApiError (statusCode),
    // so we no longer read err.response.status like with the raw axios instance.
    if (err instanceof ApiError && err.statusCode === 404) return null
    throw err
  }
}
