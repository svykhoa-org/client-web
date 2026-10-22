import type { PublicProfile } from '@/models/PublicProfile'

import { httpClient } from '../apiClient'

export async function getPublicProfile(id: string): Promise<PublicProfile> {
  const response = await httpClient.get<PublicProfile>(`/users/${id}/public`)
  return response.data as PublicProfile
}
