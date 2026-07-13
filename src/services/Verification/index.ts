import axiosInstance from '@/lib/axios'
import type {
  DoctorVerification,
  MyVerification,
  SubmitVerificationInput,
} from '@/models/DoctorVerification'

interface Envelope<T> {
  statusCode: number
  message: string
  data: T
}

export async function getMyVerification(): Promise<MyVerification> {
  const response = await axiosInstance.get<Envelope<MyVerification>>('/verification/me')
  return response.data.data
}

export async function submitVerification(
  input: SubmitVerificationInput,
): Promise<DoctorVerification> {
  const response = await axiosInstance.post<Envelope<DoctorVerification>>('/verification', input)
  return response.data.data
}

// Upload the licence scan through the asset pipeline; returns the asset id to
// attach to the verification submission.
export async function uploadLicenseFile(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const response = await axiosInstance.post<Envelope<{ id: string }>>(
    '/verification/upload',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return response.data.data.id
}
