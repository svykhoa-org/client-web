import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { ApiListData } from '@/shared/types/api'

import type { RequestState } from './types'

type InfiniteMode = 'replace' | 'append'

export interface UseInfiniteListOptions<TItem, TParams extends { page?: number }> {
  initialParams: TParams
  onSuccess?: (data: ApiListData<TItem>) => void
  onError?: (error: unknown) => void
}

export interface InfiniteListHookResult<
  TItem,
  TParams extends { page?: number },
> extends RequestState<ApiListData<TItem>> {
  items: TItem[]
  params: TParams
  page: number
  totalItems: number
  hasNextPage: boolean
  isLoadingInitial: boolean
  isLoadingMore: boolean
  setParams: (update: TParams | ((previous: TParams) => TParams)) => void
  setParam: <K extends keyof TParams>(key: K, value: TParams[K]) => void
  loadMore: () => void
  refresh: () => void
  reset: () => void
}

export function useInfiniteList<TItem, TParams extends { page?: number }>(
  requestFn: (params: TParams) => Promise<ApiListData<TItem>>,
  options: UseInfiniteListOptions<TItem, TParams>,
): InfiniteListHookResult<TItem, TParams> {
  const { initialParams, onSuccess, onError } = options

  const [params, setParamsState] = useState<TParams>(initialParams)
  const [data, setData] = useState<ApiListData<TItem> | null>(null)
  const [items, setItems] = useState<TItem[]>([])
  const [page, setPage] = useState<number>(Number(initialParams.page ?? 1))
  const [totalItems, setTotalItems] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [error, setError] = useState<unknown | null>(null)
  const [isLoadingInitial, setIsLoadingInitial] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const requestIdRef = useRef(0)
  const modeRef = useRef<InfiniteMode>('replace')

  const requestFnRef = useRef(requestFn)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)

  requestFnRef.current = requestFn
  onSuccessRef.current = onSuccess
  onErrorRef.current = onError

  const setParams = useCallback((update: TParams | ((previous: TParams) => TParams)) => {
    modeRef.current = 'replace'
    setParamsState(previous => (typeof update === 'function' ? update(previous) : update))
  }, [])

  const setParam = useCallback(<K extends keyof TParams>(key: K, value: TParams[K]) => {
    modeRef.current = 'replace'
    setParamsState(previous => ({
      ...previous,
      [key]: value,
    }))
  }, [])

  const fetchByParams = useCallback(async (nextParams: TParams, mode: InfiniteMode) => {
    const requestId = ++requestIdRef.current

    if (mode === 'replace') {
      setIsLoadingInitial(true)
    } else {
      setIsLoadingMore(true)
    }

    setError(null)

    try {
      const response = await requestFnRef.current(nextParams)

      if (requestId !== requestIdRef.current) {
        return
      }

      setData(response)
      setItems(previous => (mode === 'replace' ? response.items : [...previous, ...response.items]))
      setPage(response.pagination.page)
      setTotalItems(response.pagination.totalItems)
      setHasNextPage(
        response.pagination.hasNext ?? response.pagination.page < response.pagination.totalPages,
      )

      onSuccessRef.current?.(response)
    } catch (nextError) {
      setError(nextError)
      onErrorRef.current?.(nextError)
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoadingInitial(false)
        setIsLoadingMore(false)
      }
    }
  }, [])

  useEffect(() => {
    const nextMode = modeRef.current
    void fetchByParams(params, nextMode)
    modeRef.current = 'replace'
  }, [fetchByParams, params])

  const loadMore = useCallback(() => {
    if (isLoadingInitial || isLoadingMore || !hasNextPage) return

    modeRef.current = 'append'
    setParamsState(previous => ({
      ...previous,
      page: Number(page) + 1,
    }))
  }, [hasNextPage, isLoadingInitial, isLoadingMore, page])

  const refresh = useCallback(() => {
    modeRef.current = 'replace'
    setParamsState(previous => ({ ...previous }))
  }, [])

  const reset = useCallback(() => {
    requestIdRef.current += 1
    modeRef.current = 'replace'
    setData(null)
    setItems([])
    setPage(Number(initialParams.page ?? 1))
    setTotalItems(0)
    setHasNextPage(true)
    setError(null)
    setIsLoadingInitial(false)
    setIsLoadingMore(false)
    setParamsState(initialParams)
  }, [initialParams])

  return useMemo(
    () => ({
      items,
      data,
      error,
      isLoading: isLoadingInitial || isLoadingMore,
      params,
      page,
      totalItems,
      hasNextPage,
      isLoadingInitial,
      isLoadingMore,
      setParams,
      setParam,
      loadMore,
      refresh,
      reset,
    }),
    [
      data,
      error,
      hasNextPage,
      isLoadingInitial,
      isLoadingMore,
      items,
      loadMore,
      page,
      params,
      refresh,
      reset,
      setParam,
      setParams,
      totalItems,
    ],
  )
}
