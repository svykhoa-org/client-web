import type { SuccessResponse } from '@/common/interface/ServiceResponse'
import type { ArticleCategoryRef } from '@/models/Article'

import { httpClient } from '../apiClient'

// Public list of article categories (backend `@Get()` is `@Public()`).
// Backing the category chips on the article list page.
export const getArticleCategories = async (): Promise<ArticleCategoryRef[]> => {
  const res = await httpClient.get<ArticleCategoryRef[]>('/article-categories')
  return ((res as SuccessResponse<ArticleCategoryRef[]>).data as ArticleCategoryRef[]) ?? []
}
