import type {
  DoctorVerification,
  MyVerification,
  SubmitVerificationInput,
} from '@/models/DoctorVerification'

import { httpClient } from '../apiClient'

export async function getMyVerification(): Promise<MyVerification> {
  const response = await httpClient.get<MyVerification>('/verification/me')
  return response.data as MyVerification
}

export async function submitVerification(
  input: SubmitVerificationInput,
): Promise<DoctorVerification> {
  const response = await httpClient.post<DoctorVerification>('/verification', input)
  return response.data as DoctorVerification
}

// Upload the licence scan through the asset pipeline; returns the asset id to
// attach to the verification submission.
export async function uploadLicenseFile(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const response = await httpClient.post<{ id: string }>('/verification/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return (response.data as { id: string }).id
}
