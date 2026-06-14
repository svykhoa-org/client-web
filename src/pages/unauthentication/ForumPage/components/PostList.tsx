import { Spin } from 'antd'
import { FileText } from 'lucide-react'

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
  if (posts.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-3/60 bg-white px-8 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-2">
          <FileText className="h-8 w-8 text-neutral-4" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-neutral-8">Chưa có bài viết nào</h3>
        <p className="max-w-[280px] text-sm text-neutral-5">
          Hiện tại chưa có bài viết nào trong danh mục này.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map(post => (
        <PostCard key={post.id} post={post} onViewMore={onViewMore} />
      ))}

      {loading && (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      )}

      {!loading && showPagination && (
        <div className="flex justify-center py-6">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems || 100}
            onChange={onPageChange}
            showSizeChanger={false}
            defaultCurrent={1}
            defaultPageSize={10}
          />
        </div>
      )}
    </div>
  )
}

export default PostList
