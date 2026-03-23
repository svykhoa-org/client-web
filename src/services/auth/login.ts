import axiosInstance from '@/lib/axios'
import type { ApiDetailResponse } from '@/shared/types/api'
import { unwrapDetail } from '@/utils/apiResponse'

import type { AuthResponseData, LoginRequest } from './types'

const AUTH_LOGIN_ENDPOINT = '/auth/login'

export async function login(input: LoginRequest): Promise<AuthResponseData> {
  const response = await axiosInstance.post<ApiDetailResponse<AuthResponseData>>(
    AUTH_LOGIN_ENDPOINT,
    input,
  )

  return unwrapDetail(response.data)
}
