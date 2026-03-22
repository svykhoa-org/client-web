import type { ListResponseData, SuccessResponse } from '@/common/interface/ServiceResponse';
import type { Resource } from '@/models/Resource';

import { httpClient } from '../apiClient';

export type GetResourcesResponse = ListResponseData<Resource>;

export const getResources = async (params?: {
  limit?: number;
  page?: number;
  categoryId?: string;
  isFree?: boolean;
}): Promise<SuccessResponse<GetResourcesResponse>> => {
  // Use mock data in development environment
  if (import.meta.env.DEV) {
    // Import mock data dynamically
    const { mockResources } = await import('@/mocks/resources');

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    // Filter resources based on params
    let filteredResources = [...mockResources];

    if (params?.categoryId) {
      filteredResources = filteredResources.filter(resource => resource.categoryId === params.categoryId);
    }

    if (params?.isFree !== undefined) {
      filteredResources = filteredResources.filter(resource => (resource.price === 0) === params.isFree);
    }

    // Paginate resources
    const paginatedResources = filteredResources.slice(start, end);

    // Create response structure
    const response: GetResourcesResponse = {
      hits: paginatedResources,
      metadata: {
        total: filteredResources.length,
        page,
        limit,
        totalPages: Math.ceil(filteredResources.length / limit),
      },
    };

    return {
      statusCode: 200,
      message: 'Resources fetched successfully',
      data: response,
      timestamp: new Date().toISOString(),
    };
  }

  // Pass parameters directly as query string parameters
  // This prevents Axios from nesting them under a params key
  return await httpClient.get<GetResourcesResponse>('/resources', params);
};

export const getResourceById = async (id: string): Promise<SuccessResponse<Resource>> => {
  // Use mock data in development environment
  if (import.meta.env.DEV) {
    // Import mock data dynamically
    const { mockResources } = await import('@/mocks/resources');

    // Find resource by ID
    const resource = mockResources.find(resource => resource._id === id);

    if (resource) {
      return {
        statusCode: 200,
        message: 'Resource fetched successfully',
        data: resource,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Simulate 404 response
      throw new Error('Resource not found');
    }
  }

  // No need to pass params for this request
  return await httpClient.get<Resource>(`/resources/${id}`);
};

export const getFeaturedResources = async (limit: number = 5): Promise<SuccessResponse<Resource[]>> => {
  // Use mock data in development environment
  if (import.meta.env.DEV) {
    // Import mock data dynamically
    const { featuredResources } = await import('@/mocks/resources');

    // Return a limited number of featured resources based on the limit parameter
    const limitedResources = featuredResources.slice(0, limit);

    // Simulate API response structure
    return {
      statusCode: 200,
      message: 'Featured resources fetched successfully',
      data: limitedResources,
      timestamp: new Date().toISOString(),
    };
  }

  // In production, call the actual API
  return await httpClient.get<Resource[]>('/resources/featured', { limit });
};
