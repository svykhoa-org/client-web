import type { Article } from '@/models/Article'

import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from '../_shared/constants'
import type { BaseQuery, ResponseListSuccess, Searcher, Sorter } from '../_shared/types/query.types'
import apiClient from '../_shared/utils/api'
import { bindStage } from '../_shared/utils/bind-stage'
import { buildSearcherParams, buildSorterParams } from '../_shared/utils/query'
import { mockArticles } from './mockArticles'

export interface GetArticles extends BaseQuery {
  searcher: Searcher<Article>
  sorter: Sorter<Article>
}

export const getArticles = bindStage<GetArticles, ResponseListSuccess<Article>>({
  stage: 'mock',
  mockFn: async ({ page = PAGE_DEFAULT, pageSize = PAGE_SIZE_DEFAULT }) => {
    await Promise.resolve(new Promise(resolve => setTimeout(resolve, 2000)))
    return {
      statusCode: 200,
      message: 'Articles fetched successfully',
      data: {
        hits: mockArticles.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          total: mockArticles.length,
          totalPages: Math.ceil(mockArticles.length / (pageSize || 10)),
        },
      },
    }
  },
  devFn: async ({ page = PAGE_DEFAULT, pageSize = PAGE_SIZE_DEFAULT, searcher, sorter }) => {
    const response = await apiClient.request<ResponseListSuccess<Article>>({
      url: '/articles',
      params: {
        page,
        pageSize,
        ...buildSearcherParams(searcher),
        ...buildSorterParams(sorter),
      },
    })
    return response.data
  },
})
