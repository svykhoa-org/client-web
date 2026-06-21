import type { ProctoringSnapshotStatus } from '@/types/course-api'

import { httpClient } from '../apiClient'

export interface SubmitProctoringSnapshotInput {
  lessonId: string
  status: ProctoringSnapshotStatus
  videoPositionSeconds: number
  // Required when status === 'submitted'.
  photo?: Blob | null
}

export interface ProctoringSnapshotResponse {
  id: string
  capturedAt: string
}

export async function submitProctoringSnapshot({
  lessonId,
  status,
  videoPositionSeconds,
  photo,
}: SubmitProctoringSnapshotInput): Promise<ProctoringSnapshotResponse> {
  const formData = new FormData()
  formData.append('status', status)
  formData.append('videoPositionSeconds', String(Math.floor(videoPositionSeconds)))
  if (photo) {
    formData.append('file', photo, `proctoring-${Date.now()}.jpg`)
  }

  const response = await httpClient.post<ProctoringSnapshotResponse>(
    `/lesson-progress/${lessonId}/proctoring-snapshot`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return response.data as ProctoringSnapshotResponse
}
