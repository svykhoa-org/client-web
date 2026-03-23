import axiosInstance from '@/lib/axios'
import type { ApiDetailResponse } from '@/shared/types/api'
import { unwrapDetail } from '@/utils/apiResponse'

import type { AuthResponseData, RegisterRequest } from './types'

const AUTH_REGISTER_ENDPOINT = '/auth/register'

export async function register(input: RegisterRequest): Promise<AuthResponseData> {
  const response = await axiosInstance.post<ApiDetailResponse<AuthResponseData>>(
    AUTH_REGISTER_ENDPOINT,
    input,
  )

  return unwrapDetail(response.data)
}
