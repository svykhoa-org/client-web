// Server response types based on your backend structure
export interface SuccessResponse<T> {
  statusCode: number;
  message: string;
  data: T | ListResponseData<T> | null;
  timestamp: string;
  path?: string;
  metadata?: Record<string, unknown>;
}

// New list response format from backend
export interface ListResponseDataV2<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    [key: string]: unknown;
  };
}

export interface ListResponseData<T> {
  hits: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    [key: string]: unknown;
  };
}

export interface ErrorResponse {
  status: 'error';
  statusCode: number;
  message: string;
  error?: string;
  errorCode?: string;
  requestId?: string;
  timestamp?: string;
  stack?: string;
  path?: string;
  method?: string;
}

// Legacy types for backward compatibility
export type ResponseListSuccess<T> = {
  statusCode: number;
  message: string;
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ResponseSingleSuccess<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type ResponseError = {
  statusCode: number;
  message: string;
  error: string;
};
