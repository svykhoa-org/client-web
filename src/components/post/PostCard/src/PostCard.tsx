import dayjs from 'dayjs'

import Card from '@/components/ui/Card'
import type { Post } from '@/models/Post'

type PostCardProps = {
  post: Post
  onViewMore?: (post: Post) => void
}

const PostCard = (props: PostCardProps) => {
  const { post, onViewMore } = props

  const formatDate = (dateString: string) => {
    return dayjs(dateString).locale('vi').format('HH:mm DD/MM/YYYY [GMT]Z')
  }

  const handleCardClick = () => {
    onViewMore?.(post)
  }

  return (
    <Card
      title={post.title}
      className="cursor-pointer bg-white hover:border-green-100"
      onClick={handleCardClick}
    >
      <div className="space-y-2">
        {/* Author and Category Info */}
        <div className="text-neutral-6 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {post.author ? (
              <>
                {post.author.avatarUrl ? (
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.fullName}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <div className="bg-neutral-3 flex h-6 w-6 items-center justify-center rounded-full">
                    <span className="text-neutral-9 text-xs font-medium">
                      {post.author.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span>{post.author.fullName}</span>
              </>
            ) : (
              <span className="font-medium">Ẩn danh</span>
            )}
          </div>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>

        {/* Post Content */}
        <div className="prose prose-sm max-w-none">
          <div
            className="text-neutral-7 line-clamp-2 overflow-hidden leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-primary-1 text-primary-8 rounded-full px-2 py-1 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Statistics */}
        <div className="text-neutral-5 flex items-center justify-between border-t pt-2 text-sm">
          <div className="flex items-center space-x-4">
            {post.viewCount !== undefined && (
              <span className="flex items-center">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {post.viewCount} lượt xem
              </span>
            )}
            {post.commentCount !== undefined && (
              <span className="flex items-center">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {post.commentCount} bình luận
              </span>
            )}
          </div>

          {/* Empty space for layout balance */}
          <div></div>
        </div>

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="pt-2">
            <span className="text-neutral-6 flex items-center text-sm">
              <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              {post.attachments.length} tệp đính kèm
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default PostCard
