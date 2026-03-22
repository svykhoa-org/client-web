import { apiConfig } from '@/config/api';

import { HttpClient } from './httpClient';

// Default client với /api/v1
export const httpClient = new HttpClient(apiConfig.apiBaseURL);

// Utility để tạo client với custom config
export const createApiClient = (options?: { baseURL?: string; apiVersion?: string; timeout?: number }) => {
  let baseURL = apiConfig.baseURL;

  if (options?.baseURL) {
    baseURL = options.baseURL;
  }

  if (options?.apiVersion) {
    baseURL = `${baseURL}/api/${options.apiVersion}`;
  } else {
    baseURL = apiConfig.apiBaseURL;
  }

  return new HttpClient(baseURL);
};
