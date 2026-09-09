import type { ListResponseDataV2, SuccessResponse } from '@/common/interface/ServiceResponse'
import type { Bulletin } from '@/models/Bulletin'

import { httpClient } from '../apiClient'

export interface GetBulletinsParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
}

// Public list of PUBLISHED, non-expired bulletins (pinned/featured first).
export const getBulletins = async (
  params: GetBulletinsParams = {},
): Promise<ListResponseDataV2<Bulletin>> => {
  const res = await httpClient.get<ListResponseDataV2<Bulletin>>(
    '/bulletins',
    params as Record<string, unknown>,
  )
  return (res as SuccessResponse<ListResponseDataV2<Bulletin>>).data as ListResponseDataV2<Bulletin>
}
