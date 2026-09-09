import type { SuccessResponse } from '@/common/interface/ServiceResponse'
import type { BulletinCategoryRef } from '@/models/Bulletin'

import { httpClient } from '../apiClient'

// Public list of bulletin categories (backend `@Get()` is `@Public()`).
// Backing the category chips on the bulletin list page.
export const getBulletinCategories = async (): Promise<BulletinCategoryRef[]> => {
  const res = await httpClient.get<BulletinCategoryRef[]>('/bulletin-categories')
  return ((res as SuccessResponse<BulletinCategoryRef[]>).data as BulletinCategoryRef[]) ?? []
}
