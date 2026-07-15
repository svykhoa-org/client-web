import { unwrapSuccess } from '@/utils/apiResponse'

import { httpClient } from '../apiClient'
import type { AuthResponseData, LoginRequest } from './types'

const AUTH_LOGIN_ENDPOINT = '/auth/login'

export async function login(input: LoginRequest): Promise<AuthResponseData> {
  const response = await httpClient.post<AuthResponseData>(AUTH_LOGIN_ENDPOINT, input)

  return unwrapSuccess(response)
}
