import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Breadcrumb } from 'antd'

import { AsyncLoading } from '@/components/ui/AsyncLoading'
import Card from '@/components/ui/Card'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { useAsyncState } from '@/hooks/useAsyncState'
import { useLayout } from '@/hooks/useLayout'
import type { Category } from '@/models/Category'
import type { Post } from '@/models/Post'
import { getCategories } from '@/services/category/mockCategoryService'
import { getPostById } from '@/services/post/mockGetPosts'

import CategorySidebar from '../../ForumPage/components/CategorySidebar'
import CommentSection from './components/CommentSection'

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setLeftSidebar, setRightSidebar, setBanner } = useLayout()
  const [showFullContent, setShowFullContent] = useState(false)

  const postState = useAsyncState<Post>()
  const categoriesState = useAsyncState<Category[]>()

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Load post by ID
  useEffect(() => {
    if (!id) return

    postState.execute(() => getPostById(id).then(response => response.data as Post))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Load categories
  useEffect(() => {
    categoriesState.execute(() =>
      getCategories().then(response => response.data?.hits as Category[]),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      if (categoryId) {
        navigate(`/forum?category=${categoryId}`)
      } else {
        navigate('/forum')
      }
    },
    [navigate],
  )

  // Set sidebars and banner
  useEffect(() => {
    setLeftSidebar(
      <AsyncLoading loading={categoriesState.state.loading} type="skeleton">
        <CategorySidebar
          categories={categoriesState.state.data || []}
          selectedCategory={postState.state.data?.categoryId || ''}
          onCategorySelect={handleCategorySelect}
        />
      </AsyncLoading>,
    )

    setRightSidebar(null)
    setBanner(null)

    return () => {
      setLeftSidebar(null)
      setRightSidebar(null)
      setBanner(null)
    }
  }, [
    categoriesState.state.data,
    categoriesState.state.loading,
    postState.state.data?.categoryId,
    setLeftSidebar,
    setRightSidebar,
    setBanner,
    handleCategorySelect,
  ])

  if (postState.state.loading) {
    return (
      <div className="bg-neutral-2 py-8">
        <div className="container mx-auto px-4">
          <AsyncLoading
            loading={true}
            type="skeleton"
            skeleton={{ rows: 5, avatar: true, title: true }}
          >
            <div />
          </AsyncLoading>
        </div>
      </div>
    )
  }

  if (postState.state.error || !postState.state.data) {
    return (
      <div className="bg-neutral-2 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="headline-2 text-neutral-9 mb-4">
              {postState.state.error || 'Bài viết không tồn tại'}
            </h1>
            <button
              onClick={() => navigate('/forum')}
              className="link text-primary-6 hover:text-primary-7"
            >
              Quay về diễn đàn
            </button>
          </div>
        </div>
      </div>
    )
  }

  const post = postState.state.data
  const category = categoriesState.state.data?.find(c => c.id === post.categoryId)

  return (
    <div className="bg-neutral-2">
      <div className="container mx-auto flex flex-col gap-4 px-4">
        <Breadcrumb
          items={[
            { title: 'Diễn đàn', onClick: () => navigate('/forum') },
            {
              title: category?.name,
              onClick: () => navigate(`/forum?category=${category?.id}`),
            },
            { title: post.title },
          ]}
        />

        {/* Post Content */}
        <Card>
          <div className="p-8">
            {/* Post Header */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                {category && (
                  <span
                    className="bg-primary-1 text-primary-8 caption hover:bg-primary-2 inline-flex cursor-pointer items-center rounded-full px-3 py-1 font-semibold transition-colors"
                    onClick={() => handleCategorySelect(category.id || '')}
                  >
                    {category.name}
                  </span>
                )}
                <time className="caption text-neutral-6">
                  {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              <h1 className="headline-1 text-neutral-9 mb-4">{post.title}</h1>

              <div className="body-2 text-neutral-6 mb-5 flex items-center">
                <div className="mr-6 flex items-center">
                  <div className="bg-primary-6 mr-3 flex h-8 w-8 items-center justify-center rounded-full font-semibold text-white">
                    {post.author?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span>Bởi {post.author?.fullName || 'Người dùng'}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.commentCount || 0} bình luận
                  </span>
                  <span className="flex items-center">
                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.viewCount || 0} lượt xem
                  </span>
                </div>
              </div>
            </div>

            {/* Post Content with Markdown formatting */}
            <div className="prose prose-lg max-w-none">
              <MarkdownRenderer content={post.content} showFullContent={showFullContent} />
              {post.content.length > 1000 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowFullContent(!showFullContent)}
                    className="text-primary-6 hover:text-primary-7 font-medium focus:outline-none"
                  >
                    {showFullContent ? 'Thu gọn' : 'Hiển thị thêm...'}
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="border-neutral-3 mt-10 border-t pt-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-primary-1 text-primary-8 hover:bg-primary-2 caption inline-flex cursor-pointer items-center rounded-full px-2 py-0.5 font-medium transition-colors"
                      onClick={() => navigate(`/forum?search=${encodeURIComponent(tag)}`)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <CommentSection postId={post.id || ''} />
      </div>
    </div>
  )
}

export default PostDetailPage
