import { useCallback, useState } from 'react'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface UseAsyncStateResult<T> {
  state: AsyncState<T>
  execute: (asyncFunction: () => Promise<T>) => Promise<T | void>
  reset: () => void
  setData: (data: T) => void
}

export const useAsyncState = <T>(): UseAsyncStateResult<T> => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const result = await asyncFunction()
      setState({
        data: result,
        loading: false,
        error: null,
      })
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  const setData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      data,
      error: null,
    }))
  }, [])

  return {
    state,
    execute,
    reset,
    setData,
  }
}
