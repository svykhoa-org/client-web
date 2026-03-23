import axiosInstance from '@/lib/axios'
import type { ApiDetailResponse } from '@/shared/types/api'
import { unwrapDetail } from '@/utils/apiResponse'

const AUTH_LOGOUT_ENDPOINT = '/auth/logout'

export async function logout(): Promise<void> {
  const response = await axiosInstance.post<ApiDetailResponse<null>>(AUTH_LOGOUT_ENDPOINT)

  unwrapDetail(response.data)
}
