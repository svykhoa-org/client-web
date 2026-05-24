import { useCallback, useState } from 'react'

import { search } from '@/services/Search/search'

export interface SearchingState {
  loading: boolean
  rawResult: string
  error: string | null
}

const initialState: SearchingState = {
  loading: false,
  rawResult: '',
  error: null,
}

export const useSearching = () => {
  const [searchingState, setSearchingState] = useState<SearchingState>(initialState)

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    console.log('Bắt đầu tìm kiếm:', searchQuery)

    setSearchingState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }))

    try {
      const response = await search(searchQuery)
      console.log('Kết quả tìm kiếm thành công:', response)
      setSearchingState(prev => ({
        ...prev,
        loading: false,
        rawResult: response,
        error: null,
      }))
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error)
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
      setSearchingState(prev => ({
        ...prev,
        loading: false,
        rawResult: '',
        error: errorMessage,
      }))
    }
  }, [])

  const setSearchQuery = (query: string) => {
    setSearchingState(prev => ({
      ...prev,
      searchQuery: query,
    }))
  }

  return {
    ...searchingState,
    handleSearch,
    setSearchQuery,
  }
}
