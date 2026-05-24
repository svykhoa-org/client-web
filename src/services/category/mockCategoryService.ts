import type { ListResponseData, SuccessResponse } from '@/common/interface/ServiceResponse'
import { mockCategories } from '@/mocks/categories'
import type { Category } from '@/models/Category'

export type GetCategoriesResponse = ListResponseData<Category>

// Mock implementation thay thế cho real API
export const getCategories = async (): Promise<SuccessResponse<GetCategoriesResponse>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const response: SuccessResponse<GetCategoriesResponse> = {
    statusCode: 200,
    message: 'Categories retrieved successfully',
    data: {
      hits: mockCategories,
      metadata: {
        total: mockCategories.length,
        page: 1,
        limit: mockCategories.length,
        totalPages: 1,
      },
    },
    timestamp: new Date().toISOString(),
  }

  return response
}

export const getCategoryById = async (id: string): Promise<SuccessResponse<Category>> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  const category = mockCategories.find(cat => cat.id === id)

  if (!category) {
    throw new Error('Category not found')
  }

  return {
    statusCode: 200,
    message: 'Category retrieved successfully',
    data: category,
    timestamp: new Date().toISOString(),
  }
}
