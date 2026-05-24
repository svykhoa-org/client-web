import type { Bulletin } from '@/models/Bulletin'

import { mockBulletins } from './mockBulletins'

export type GetBulletinsResponseData = Bulletin

export interface GetBulletins {
  page?: number
  limit?: number
}

export const getBulletins = async ({ page = 1, limit = 10 }: GetBulletins) => {
  await Promise.resolve(new Promise(resolve => setTimeout(resolve, 2000)))
  return {
    code: 200,
    message: 'Bulletins fetched successfully',
    data: {
      items: mockBulletins.slice((page - 1) * (limit || 10), page * (limit || 10)),
      pagination: {
        totalItems: mockBulletins.length,
        totalPages: Math.ceil(mockBulletins.length / (limit || 10)),
        page: page || 1,
        limit: limit || 10,
      },
    },
  }
}
