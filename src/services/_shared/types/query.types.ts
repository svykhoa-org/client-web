export type SearchOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
export type SortOperator = 'asc' | 'desc';

export interface SearchCondition {
  op: SearchOperator;
  value: string | number | boolean | (string | number)[];
}

export type Searcher<T> = Partial<Record<keyof T, SearchCondition>>;

export type Sorter<T> = Partial<Record<keyof T, SortOperator>>;

export type ApiQuery<T> = {
  searcher?: Searcher<T>;
  sorter?: Sorter<T>;
  page?: number;
  pageSize?: number;
};

export interface BaseQuery {
  page: number;
  pageSize: number;
}

export interface Pagination {
  total: number;
  totalPages: number;
  [key: string]: unknown;
}

export interface ResponseListSuccess<T> {
  statusCode: number;
  message: string;
  data: {
    hits: T[];
    pagination: Pagination;
  };
}

export interface ResponseDetailSuccess<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}
