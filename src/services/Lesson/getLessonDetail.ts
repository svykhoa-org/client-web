import { httpClient } from '../apiClient'

export interface GetLessonDetailParams {
  courseId: string
  lessonId: string
}

export interface GetLessonDetailResponse {
  streamUrl: string
  expiresAt: string
}

export async function getLessonDetail(params: GetLessonDetailParams): Promise<{
  statusCode: number
  message: string
  data: GetLessonDetailResponse
}> {
  const response = await httpClient.get<GetLessonDetailResponse>(
    `/lessons/${params.lessonId}/stream-url`,
  )
  if (response.statusCode !== 200) {
    throw new Error(response.message || 'Failed to fetch lesson stream URL')
  }
  if (!response.data) throw new Error('No lesson data returned')
  return {
    statusCode: response.statusCode,
    message: response.message,
    data: response.data as GetLessonDetailResponse,
  }
}
