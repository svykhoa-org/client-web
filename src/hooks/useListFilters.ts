import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { useDebounceValue } from './useDebounce'

// URL-synced list filters shared by the article and bulletin list pages.
// The URL query is the source of truth for `category` (a human-readable category
// slug, so a selected chip is shareable/bookmarkable and a breadcrumb can
// deep-link into a filtered list) and `q` (debounced search text). The page maps
// the slug to a categoryId for the API. Search input stays local for
// responsiveness; its debounced value is mirrored into `?q=`.
export const useListFilters = () => {
  const [params, setParams] = useSearchParams()
  const categorySlug = params.get('category') ?? ''
  const [searchInput, setSearchInput] = useState(params.get('q') ?? '')
  const debouncedSearch = useDebounceValue(searchInput, 400)

  // Reflect the debounced search into the URL (replace: no history spam per keystroke).
  useEffect(() => {
    setParams(
      prev => {
        const next = new URLSearchParams(prev)
        if ((next.get('q') ?? '') === debouncedSearch) return prev
        if (debouncedSearch) next.set('q', debouncedSearch)
        else next.delete('q')
        return next
      },
      { replace: true },
    )
  }, [debouncedSearch, setParams])

  const setCategorySlug = useCallback(
    (slug: string) => {
      setParams(prev => {
        const next = new URLSearchParams(prev)
        if (slug) next.set('category', slug)
        else next.delete('category')
        return next
      })
    },
    [setParams],
  )

  return { categorySlug, setCategorySlug, searchInput, setSearchInput, debouncedSearch }
}
