import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { SearchOutlined } from '@ant-design/icons'
import { Input, Select } from 'antd'

import { ProtectedButton } from '@/components/auth'
import { AsyncLoading } from '@/components/ui/AsyncLoading'
import Button from '@/components/ui/Button'
import { useAsyncState } from '@/hooks/useAsyncState'
import { useDebounceValue } from '@/hooks/useDebounce'
import type { Category } from '@/models/Category'
import type { Post } from '@/models/Post'
import { getCategories } from '@/services/category/categoryService'
import { type GetPostsResponse, getPosts } from '@/services/post/getPosts'

import PostList from './components/PostList'

const { Search } = Input

const PostsPage: React.FC = () => {
  const navigate = useNavigate()

  // URL search params
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || ''
  const queryParam = searchParams.get('q') || ''
  const sortParam = searchParams.get('sort') || 'latest'

  // Component state
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam)
  const [searchQuery, setSearchQuery] = useState<string>(queryParam)
  const [sortOption, setSortOption] = useState<string>(sortParam)
  const [currentPage, setCurrentPage] = useState(1)

  // Debounced search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounceValue(searchQuery, 500)

  // Data fetching state
  const postsState = useAsyncState<GetPostsResponse>()
  const categoriesState = useAsyncState<Category[]>()

  // Load posts with filters
  const loadPosts = useCallback(async () => {
    // Don't execute if already loading
    if (postsState.state.loading) return

    await postsState.execute(() =>
      getPosts({
        page: currentPage,
        limit: 10,
        ...(selectedCategory && { category: selectedCategory }),
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        ...(sortOption && { sort: sortOption }),
      }).then(response => response.data as GetPostsResponse),
    )
  }, [selectedCategory, debouncedSearchQuery, sortOption, currentPage])

  const loadCategories = useCallback(async () => {
    if (categoriesState.state.data || categoriesState.state.loading) return

    await categoriesState.execute(() =>
      getCategories().then(response => response.data?.hits as Category[]),
    )
  }, [])

  // Update URL search params when filters change
  // Use debounced search query for URL updates to avoid frequent URL changes
  useEffect(() => {
    const params = new URLSearchParams()

    if (selectedCategory) params.set('category', selectedCategory)
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery)
    if (sortOption) params.set('sort', sortOption)

    setSearchParams(params)
  }, [selectedCategory, debouncedSearchQuery, sortOption, setSearchParams])

  // Load data when filters change
  // This effect will run when any of the dependencies of loadPosts change
  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  // Load categories once on mount
  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    // Reset to first page when changing category
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }

  // Handle search submit
  // The actual API call will happen when debouncedSearchQuery changes via useEffect
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    // Reset to first page when searching
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value)
    // No need to reset page on sort change
  }

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle view post details
  const handleViewPost = (post: Post) => {
    navigate(`/post/${post.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Bài viết</h1>
        <p className="text-gray-600">
          Tìm kiếm và khám phá các bài viết về sức khỏe, y tế và chăm sóc sức khỏe
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="mb-4">
          <Search
            placeholder="Tìm kiếm bài viết..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            defaultValue={searchQuery}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-1 items-center gap-2">
            <span className="text-gray-600">Danh mục:</span>
            <Select
              placeholder="Tất cả danh mục"
              onChange={handleCategoryChange}
              value={selectedCategory || undefined}
              style={{ minWidth: 180 }}
              allowClear
              loading={categoriesState.state.loading}
              className="flex-1"
            >
              {categoriesState.state.data?.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sắp xếp:</span>
            <Select defaultValue={sortOption} onChange={handleSortChange} style={{ width: 150 }}>
              <Select.Option value="latest">Mới nhất</Select.Option>
              <Select.Option value="popular">Phổ biến nhất</Select.Option>
              <Select.Option value="comments">Nhiều bình luận</Select.Option>
            </Select>
          </div>

          <ProtectedButton
            variant="filled"
            onClick={() => navigate('/post/create')}
            modalTitle="Yêu cầu đăng nhập"
            modalContent="Bạn cần đăng nhập để tạo bài viết mới."
            fallbackText="Đăng nhập để tạo bài viết"
          >
            Tạo bài viết
          </ProtectedButton>
        </div>
      </div>

      {/* Posts list */}
      <AsyncLoading
        loading={postsState.state.loading && currentPage === 1}
        type="skeleton"
        skeleton={{ rows: 5, avatar: true, title: true }}
      >
        <div>
          <PostList
            posts={postsState.state.data?.hits || []}
            onViewMore={handleViewPost}
            onPageChange={handlePageChange}
            loading={postsState.state.loading}
            currentPage={currentPage}
            totalItems={postsState.state.data?.metadata?.total || 0}
            pageSize={postsState.state.data?.metadata?.limit || 10}
            showPagination={true}
          />

          {/* No results */}
          {postsState.state.data?.hits.length === 0 && !postsState.state.loading && (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-500">Không tìm thấy bài viết phù hợp</p>
              <p className="mt-2 text-gray-400">Vui lòng thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      </AsyncLoading>

      {/* Error state */}
      {postsState.state.error && (
        <div className="my-6 rounded-lg bg-white p-6 text-center shadow-sm">
          <p className="mb-4 text-red-500">{postsState.state.error}</p>
          <Button onClick={loadPosts}>Thử lại</Button>
        </div>
      )}
    </div>
  )
}

export default PostsPage
