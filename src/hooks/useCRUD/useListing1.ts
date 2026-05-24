import { useCallback, useEffect, useState } from 'react'

import type { ResponseError, ResponseListSuccess } from '@/common/interface/ServiceResponse'

export type UseListing<T> = {
  getListService?: (page: number, limit: number) => Promise<ResponseListSuccess<T> | ResponseError>
}

export type ListingState<T> = {
  data: T[]
  loading: boolean
  hasMore: boolean
  currentPage: number
  limit?: number
  totalPages: number
}

export const useListing = <T>({ getListService }: UseListing<T>) => {
  const [listingState, setListingState] = useState<ListingState<T>>({
    data: [],
    loading: false,
    hasMore: true,
    currentPage: 1,
    totalPages: 1,
  })

  const fetchList = useCallback(
    async (page: number, limit: number) => {
      setListingState(prev => ({ ...prev, loading: true }))
      try {
        const response = await getListService?.(page, limit)

        if (response && 'data' in response) {
          setListingState(prev => ({
            ...prev,
            data: response.data,
            loading: false,
            currentPage: page,
            totalPages: response.metadata.totalPages,
            hasMore: page < response.metadata.totalPages,
          }))
        } else {
          setListingState(prev => ({
            ...prev,
            loading: false,
            hasMore: false,
          }))
        }
      } catch (error) {
        console.error('Error fetching list:', error)
        setListingState(prev => ({ ...prev, loading: false, hasMore: false }))
      }
    },
    [getListService],
  )

  useEffect(() => {
    if (getListService) {
      fetchList(listingState.currentPage, listingState.limit || 10)
    }
  }, [fetchList, getListService, listingState.currentPage, listingState.limit])

  return { ...listingState, fetchList, setListingState }
}
