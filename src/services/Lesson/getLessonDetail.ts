import { AppConfig } from '@/constants/AppConfig'

import { httpClient } from '../apiClient'

export interface GetLessonDetailParams {
  courseId: string
  lessonId: string
}

export interface GetLessonDetailResponse {
  streamUrl: string
  expiresAt: string
}

function resolveStreamUrl(path: string): string {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const base = AppConfig.API_FILE_URL.replace(/\/+$/, '')
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
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
  const data = response.data as GetLessonDetailResponse
  return {
    statusCode: response.statusCode,
    message: response.message,
    data: { ...data, streamUrl: resolveStreamUrl(data.streamUrl) },
  }
}
