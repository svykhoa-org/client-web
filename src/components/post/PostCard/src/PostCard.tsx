import dayjs from 'dayjs'
import { Eye, MessageCircle, Paperclip, Pin } from 'lucide-react'

import type { Post } from '@/models/Post'

type PostCardProps = {
  post: Post
  onViewMore?: (post: Post) => void
}

const PostCard = ({ post, onViewMore }: PostCardProps) => {
  const formatDate = (dateString: string) => dayjs(dateString).format('DD/MM/YYYY')

  const initials = (name: string) =>
    name
      .split(' ')
      .map(n => n[0])
      .slice(-2)
      .join('')
      .toUpperCase()

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-3/60 bg-white transition-all duration-200 hover:border-primary-4 hover:shadow-[0_4px_20px_rgba(25,118,210,0.10)]"
      onClick={() => onViewMore?.(post)}
    >
      {/* Left accent bar */}
      <span className="absolute left-0 top-0 h-full w-0.5 bg-transparent transition-all duration-200 group-hover:bg-primary-5" />

      <div className="px-5 py-4">
        {/* Top row: pinned + category + date */}
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {post.isPinned && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-warning-1 px-2 py-0.5 text-xs font-semibold text-warning-3">
                <Pin className="h-3 w-3" />
                Ghim
              </span>
            )}
            {post.category && (
              <span className="truncate rounded-full bg-primary-1 px-2.5 py-0.5 text-xs font-medium text-primary-7">
                {post.category.name}
              </span>
            )}
          </div>
          <time className="shrink-0 text-xs text-neutral-5" dateTime={post.createdAt}>
            {formatDate(post.createdAt)}
          </time>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-neutral-9 transition-colors group-hover:text-primary-6">
          {post.title}
        </h3>

        {/* Content preview */}
        <div
          className="mb-3 line-clamp-2 text-sm leading-relaxed text-neutral-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="rounded-md bg-neutral-2 px-2 py-0.5 text-xs text-neutral-6">
                #{tag}
              </span>
            ))}
            {post.tags.length > 4 && (
              <span className="py-0.5 text-xs text-neutral-4">+{post.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Bottom: author + stats */}
        <div className="flex items-center justify-between border-t border-neutral-2 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            {post.author ? (
              <>
                {post.author.avatarUrl ? (
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.fullName}
                    className="h-7 w-7 shrink-0 rounded-full object-cover ring-2 ring-neutral-2"
                  />
                ) : (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-1 ring-2 ring-primary-2">
                    <span className="text-[10px] font-bold text-primary-7">
                      {initials(post.author.fullName)}
                    </span>
                  </div>
                )}
                <span className="truncate text-sm font-medium text-neutral-7">
                  {post.author.fullName}
                </span>
              </>
            ) : (
              <span className="text-sm text-neutral-5">Ẩn danh</span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3 text-xs text-neutral-5">
            {post.viewCount !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {post.viewCount}
              </span>
            )}
            {post.commentCount !== undefined && (
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {post.commentCount}
              </span>
            )}
            {post.attachments && post.attachments.length > 0 && (
              <span className="flex items-center gap-1">
                <Paperclip className="h-3.5 w-3.5" />
                {post.attachments.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
