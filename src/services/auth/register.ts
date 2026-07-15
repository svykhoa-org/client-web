import { unwrapSuccess } from '@/utils/apiResponse'

import { httpClient } from '../apiClient'
import type { AuthResponseData, RegisterRequest } from './types'

const AUTH_REGISTER_ENDPOINT = '/auth/register'

export async function register(input: RegisterRequest): Promise<AuthResponseData> {
  const response = await httpClient.post<AuthResponseData>(AUTH_REGISTER_ENDPOINT, input)

  return unwrapSuccess(response)
}
