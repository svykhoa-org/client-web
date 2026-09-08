import type { SuccessResponse } from '@/common/interface/ServiceResponse'
import type { Bulletin } from '@/models/Bulletin'

import { httpClient } from '../apiClient'

// Public bulletin detail by slug (increments viewCount, returns attachments).
export const getBulletinBySlug = async (slug: string): Promise<Bulletin> => {
  const res = await httpClient.get<Bulletin>(`/bulletins/${slug}`)
  return (res as SuccessResponse<Bulletin>).data as Bulletin
}
