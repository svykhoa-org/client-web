import { httpClient } from '../apiClient'

const AUTH_LOGOUT_ENDPOINT = '/auth/logout'

export async function logout(): Promise<void> {
  await httpClient.post<null>(AUTH_LOGOUT_ENDPOINT)
}
