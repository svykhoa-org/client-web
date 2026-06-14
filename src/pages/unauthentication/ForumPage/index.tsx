import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { PlusCircle, Search, X } from 'lucide-react'

import { ProtectedButton } from '@/components/auth'
import { AsyncLoading } from '@/components/ui/AsyncLoading'
import Button from '@/components/ui/Button'
import { useAsyncState } from '@/hooks/useAsyncState'
import { useDebounceValue } from '@/hooks/useDebounce'
import { useLayout } from '@/hooks/useLayout'
import type { Category } from '@/models/Category'
import type { Post } from '@/models/Post'
import { getCategories } from '@/services/category/mockCategoryService'
import { type GetPostsResponse, getPosts } from '@/services/post/mockGetPosts'

import CategorySidebar from './components/CategorySidebar'
import PostList from './components/PostList'

export const ForumPage = () => {
  const { setLeftSidebar, setRightSidebar, setBanner } = useLayout()
  const navigate = useNavigate()

  const [param] = useSearchParams()
  const categoryParam = param.get('category')
  const searchParam = param.get('search')

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || '')
  const [searchQuery, setSearchQuery] = useState<string>(searchParam || '')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearchQuery = useDebounceValue(searchQuery, 500)

  useEffect(() => {
    const newCategoryParam = param.get('category') || ''
    const newSearchParam = param.get('search') || ''

    setSelectedCategory(prevCategory => {
      if (newCategoryParam !== prevCategory) return newCategoryParam
      return prevCategory
    })

    setSearchQuery(prevSearch => {
      if (newSearchParam !== prevSearch) return newSearchParam
      return prevSearch
    })

    setCurrentPage(1)
  }, [param])

  const postsState = useAsyncState<GetPostsResponse>()
  const categoriesState = useAsyncState<Category[]>()

  const loadPosts = useCallback(async () => {
    await postsState.execute(() =>
      getPosts({
        page: currentPage,
        limit: 10,
        ...(selectedCategory && { category: selectedCategory }),
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
      }).then(response => response.data as GetPostsResponse),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, debouncedSearchQuery, currentPage])

  const loadCategories = useCallback(async () => {
    await categoriesState.execute(() =>
      getCategories().then(response => response.data?.hits as Category[]),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  useEffect(() => {
    if (debouncedSearchQuery !== searchParam) {
      setCurrentPage(1)
      loadPosts()
    }
  }, [debouncedSearchQuery, loadPosts, searchParam])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const handleViewMore = (post: Post) => {
    navigate(`/post/${post.id}`)
    window.scrollTo(0, 0)
  }

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      const newCategory = categoryId === selectedCategory ? '' : categoryId
      setSelectedCategory(newCategory)
      setCurrentPage(1)

      const newUrl = newCategory ? `/forum?category=${newCategory}` : '/forum'
      navigate(newUrl, { replace: true })
    },
    [selectedCategory, navigate],
  )

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSearch = useCallback(
    (query: string) => {
      const searchParams = new URLSearchParams()
      if (query.trim()) searchParams.set('search', query.trim())
      if (selectedCategory) searchParams.set('category', selectedCategory)

      const newUrl = searchParams.toString() ? `/forum?${searchParams.toString()}` : '/forum'
      navigate(newUrl, { replace: true })
    },
    [selectedCategory, navigate],
  )

  const clearSearch = useCallback(() => {
    const searchParams = new URLSearchParams()
    if (selectedCategory) searchParams.set('category', selectedCategory)

    const newUrl = searchParams.toString() ? `/forum?${searchParams.toString()}` : '/forum'
    navigate(newUrl, { replace: true })
  }, [selectedCategory, navigate])

  useEffect(() => {
    setLeftSidebar(
      <AsyncLoading loading={categoriesState.state.loading} type="skeleton">
        <CategorySidebar
          categories={categoriesState.state.data || []}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </AsyncLoading>,
    )

    setBanner(
      <div className="relative overflow-hidden bg-linear-to-br from-primary-9 via-primary-7 to-primary-5 py-10">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-white" />
          <div className="absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-white" />
          <div className="absolute right-1/3 top-1/2 h-28 w-28 rounded-full bg-white" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white">Diễn đàn Y dược Việt Nam</h1>
          <p className="text-base text-white/80">
            Nơi chia sẻ kiến thức và kinh nghiệm về y học hiện đại
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/65">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              Hàng nghìn bài viết
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              50+ chuyên khoa
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              Cộng đồng y tế chuyên nghiệp
            </span>
          </div>
        </div>
      </div>,
    )

    return () => {
      setLeftSidebar(null)
      setRightSidebar(null)
      setBanner(null)
    }
  }, [
    selectedCategory,
    categoriesState.state.data,
    categoriesState.state.loading,
    setLeftSidebar,
    setRightSidebar,
    setBanner,
    handleCategorySelect,
  ])

  const getPageTitle = () => {
    if (debouncedSearchQuery) return `Kết quả cho "${debouncedSearchQuery}"`
    if (selectedCategory) {
      const categoryName = categoriesState.state.data?.find(
        cat => cat.id === selectedCategory,
      )?.name
      return categoryName || 'Bài viết mới nhất'
    }
    return 'Bài viết mới nhất'
  }

  return (
    <div className="bg-neutral-2 pb-8">
      <div className="container mx-auto px-4">
        {/* Page header */}
        <div className="mb-5 space-y-3 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-9">{getPageTitle()}</h2>
              {debouncedSearchQuery && selectedCategory && (
                <p className="mt-0.5 text-sm text-neutral-5">
                  Trong danh mục:{' '}
                  <span className="font-medium text-neutral-7">
                    {categoriesState.state.data?.find(cat => cat.id === selectedCategory)?.name}
                  </span>
                </p>
              )}
            </div>

            <ProtectedButton
              type="primary"
              icon={<PlusCircle className="h-4 w-4" />}
              onClick={() => navigate('/post/create')}
              modalTitle="Yêu cầu đăng nhập"
              modalContent="Bạn cần đăng nhập để tạo bài viết mới."
              fallbackText="Đăng nhập để tạo bài viết"
              className="flex items-center gap-1.5"
            >
              Tạo bài viết
            </ProtectedButton>
          </div>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-4" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết, tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSearch(searchQuery)
                }}
                className="w-full rounded-lg border border-neutral-3 bg-white py-2.5 pl-9 pr-9 text-sm text-neutral-9 placeholder:text-neutral-4 focus:border-primary-5 focus:ring-2 focus:ring-primary-1 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-4 transition-colors hover:text-neutral-6"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="primary" onClick={() => handleSearch(searchQuery)} className="px-5">
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Post list */}
        <AsyncLoading
          loading={postsState.state.loading && currentPage === 1}
          type="skeleton"
          skeleton={{ rows: 5, avatar: true, title: true }}
        >
          <PostList
            posts={postsState.state.data?.hits || []}
            onViewMore={handleViewMore}
            onPageChange={handlePageChange}
            loading={postsState.state.loading}
            currentPage={currentPage}
            totalItems={postsState.state.data?.metadata?.total || 100}
            pageSize={postsState.state.data?.metadata?.limit || 10}
            showPagination={true}
          />
        </AsyncLoading>

        {postsState.state.error && (
          <div className="rounded-xl border border-error-1 bg-error-1 px-6 py-8 text-center">
            <p className="mb-4 text-sm text-error-3">{postsState.state.error}</p>
            <Button onClick={loadPosts}>Thử lại</Button>
          </div>
        )}
      </div>
    </div>
  )
}
