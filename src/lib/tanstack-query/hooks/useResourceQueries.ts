import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { type Resource } from '@/models/Resource';
import { getResourceById, getResources } from '@/services/resource/resourceService';

const queryKeys = {
  resources: {
    all: ['resources'],
    list: (params: Record<string, unknown>) => [...queryKeys.resources.all, 'list', params],
    detail: (id: string) => [...queryKeys.resources.all, 'detail', id],
  },
};

interface ResourceParams extends Record<string, unknown> {
  page: number;
  pageSize?: number;
  limit?: number;
  categoryId?: string;
  isFree?: boolean;
}

export const useListResource = (params: ResourceParams) => {
  return useQuery({
    queryKey: queryKeys.resources.list(params),

    queryFn: async () => {
      const response = await getResources({
        page: params.page,
        limit: params.pageSize || params.limit,
        categoryId: params.categoryId,
        isFree: params.isFree,
      });
      return response;
    },

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 5, // 5 minutes

    select: data => {
      const responseData = data.data as unknown as { hits: Resource[]; metadata: any };
      return {
        resources: responseData?.hits || [],
        pagination: responseData?.metadata,
      };
    },
  });
};

export const useDetailResource = (id: string) => {
  return useQuery({
    queryKey: queryKeys.resources.detail(id),

    queryFn: async () => {
      const response = await getResourceById(id);
      return response;
    },

    staleTime: 1000 * 60 * 10, // 10 minutes

    select: data => data.data as Resource,
  });
};
