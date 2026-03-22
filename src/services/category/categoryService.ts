import type { ListResponseData, SuccessResponse } from '@/common/interface/ServiceResponse';
import type { Category } from '@/models/Category';

import { httpClient } from '../apiClient';

export type GetCategoriesResponse = ListResponseData<Category>;

export const getCategories = async (): Promise<SuccessResponse<GetCategoriesResponse>> => {
  return await httpClient.get<GetCategoriesResponse>('/categories');
};

export const getCategoryById = async (id: string): Promise<SuccessResponse<Category>> => {
  return await httpClient.get<Category>(`/categories/${id}`);
};
