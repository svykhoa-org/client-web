import { useEffect, useState } from 'react'

import type { BaseModel } from '@/models/BaseModel'

export interface SearchParams {
  page?: number
  limit?: number
}

export interface UseListing<Model extends BaseModel> {
  defaultSearchParams: SearchParams
  defaultResponse?: {
    data: Model[]
    totalItems: number
    totalPages: number
    page: number
    limit: number
  }
  getListService: (searchParams: SearchParams) => Promise<{
    data: Model[]
    totalItems: number
    totalPages: number
    page: number
    limit: number
  }>
}

const DEFAULT_LIMIT = 10
const DEFAULT_PAGE = 1

export const useListing = <Model extends BaseModel>({
  defaultSearchParams = {},
  defaultResponse,
  getListService,
}: UseListing<Model>) => {
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams)
  const [listingState, setListingState] = useState({
    data: defaultResponse?.data || [],
    totalItems: defaultResponse?.totalItems || 0,
    totalPages: defaultResponse?.totalPages || 0,
    page: defaultResponse?.page || DEFAULT_PAGE,
    limit: defaultResponse?.limit || DEFAULT_LIMIT,
    isLoading: !defaultResponse ? false : true,
  })

  const handleGetList = async () => {
    setListingState(prev => ({ ...prev, isLoading: true }))
    try {
      const response = await getListService(searchParams)
      setListingState(prev => ({
        ...prev,
        data: response.data,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        page: response.page,
        limit: response.limit,
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error fetching list:', error)
      setListingState(prev => ({ ...prev, isLoading: false }))
    }
  }

  useEffect(() => {
    if (!defaultResponse) handleGetList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultResponse, searchParams])

  return {
    ...listingState,
    searchParams,
    setSearchParams,
    handleGetList,
    setListingState,
  }
}
