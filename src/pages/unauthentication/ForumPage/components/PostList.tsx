import { Spin } from 'antd'

import PostCard from '@/components/post/PostCard'
import Pagination from '@/components/ui/Pagination'
import type { Post } from '@/models/Post'

interface PostListProps {
  posts: Post[]
  onViewMore?: (post: Post) => void
  onPageChange?: (page: number) => void
  loading?: boolean
  currentPage?: number
  totalItems?: number
  pageSize?: number
  showPagination?: boolean
}

const PostList = ({
  posts,
  onViewMore,
  onPageChange,
  loading = false,
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  showPagination = true,
}: PostListProps) => {
  // Debug pagination values
  console.log('PostList Pagination:', {
    currentPage,
    pageSize,
    totalItems,
    showPagination,
    postsLength: posts.length,
    hasPagination: totalItems > 0,
  })
  if (posts.length === 0 && !loading) {
    return (
      <div className="text-neutral-6 bg-neutral-1 rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg
            className="text-neutral-4 mx-auto h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-neutral-8 mb-2 text-lg font-medium">Chưa có bài viết nào</h3>
        <p className="text-sm">Hiện tại chưa có bài viết nào trong danh mục này.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="rounded-lg bg-white shadow-sm transition-all hover:shadow-md">
          <PostCard post={post} onViewMore={onViewMore} />
        </div>
      ))}

      {/* Pagination Section */}
      {loading && (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      )}

      {!loading && showPagination && (
        <div className="flex justify-center py-8">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems || 100}
            onChange={onPageChange}
            showSizeChanger={false}
            defaultCurrent={1}
            defaultPageSize={10}
            // showTotal={(total: number, range: [number, number]) =>
            //   `${range[0]}-${range[1]} của ${total} bài viết`
            // }
          />
        </div>
      )}
    </div>
  )
}

export default PostList
