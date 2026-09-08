import type { SuccessResponse } from '@/common/interface/ServiceResponse'
import type { Article } from '@/models/Article'

import { httpClient } from '../apiClient'

// Public article detail by slug. The server increments viewCount (Redis-deduped)
// and returns sanitized content + serialized thumbnail/ogImage urls.
export const getArticleBySlug = async (slug: string): Promise<Article> => {
  const res = await httpClient.get<Article>(`/articles/${slug}`)
  return (res as SuccessResponse<Article>).data as Article
}
