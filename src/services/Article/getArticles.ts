import type { ListResponseDataV2, SuccessResponse } from '@/common/interface/ServiceResponse'
import type { Article } from '@/models/Article'

import { httpClient } from '../apiClient'

export interface GetArticlesParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  featured?: boolean
}

// Public list of PUBLISHED articles (featured-first). Backing the home
// "Tin nổi bật" block — replaces the previous mock service.
export const getArticles = async (
  params: GetArticlesParams = {},
): Promise<ListResponseDataV2<Article>> => {
  const res = await httpClient.get<ListResponseDataV2<Article>>(
    '/articles',
    params as Record<string, unknown>,
  )
  return (res as SuccessResponse<ListResponseDataV2<Article>>).data as ListResponseDataV2<Article>
}
