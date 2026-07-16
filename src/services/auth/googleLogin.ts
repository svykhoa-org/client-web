import { unwrapSuccess } from '@/utils/apiResponse'

import { httpClient } from '../apiClient'
import type { AuthResponseData } from './types'

const AUTH_GOOGLE_ENDPOINT = '/auth/google'

export async function googleLogin(credential: string): Promise<AuthResponseData> {
  const response = await httpClient.post<AuthResponseData>(AUTH_GOOGLE_ENDPOINT, { credential })

  return unwrapSuccess(response)
}
