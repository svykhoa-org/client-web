import type { ForumThread } from '@/models/Forum'
import { Clock3, Eye } from 'lucide-react'
import { useNavigate } from 'react-router'

interface Props {
  thread: ForumThread
  query: string
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const plainText = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

const highlight = (text: string, query: string) => {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return text
  const escaped = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))

  return parts.map((part, index) =>
    part.toLocaleLowerCase('vi-VN') === normalizedQuery.toLocaleLowerCase('vi-VN') ? (
      <mark key={`${part}-${index}`} className="bg-warning-1 text-neutral-9">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export const SearchResultItem = ({ thread, query }: Props) => {
  const navigate = useNavigate()
  const content = plainText(thread.content)
  const excerpt = content.slice(0, 220)

  return (
    <article className="overflow-hidden rounded-lg border border-neutral-3 bg-white transition-colors hover:border-primary-3">
      <button
        type="button"
        onClick={() => navigate(`/forum/threads/${thread.id}`)}
        className="w-full p-4 text-left sm:p-5"
      >
        <span className="flex flex-wrap items-center gap-2">
          {thread.prefixTag && (
            <span className="rounded-md bg-primary-1 px-2 py-0.5 text-xs font-semibold text-primary-8">
              {thread.prefixTag.name}
            </span>
          )}
          {thread.subCategory?.name && (
            <span className="text-xs font-medium text-neutral-5">{thread.subCategory.name}</span>
          )}
        </span>

        <span className="mt-2 block text-base leading-6 font-semibold text-neutral-9">
          {highlight(thread.title, query)}
        </span>

        {excerpt && (
          <span className="mt-1.5 line-clamp-2 block text-sm leading-6 text-neutral-6">
            {highlight(excerpt, query)}
            {content.length > excerpt.length ? '…' : ''}
          </span>
        )}

        <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-5">
          <span>{thread.author?.fullName ?? 'Ẩn danh'}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDate(thread.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {thread.viewCount.toLocaleString('vi-VN')} lượt xem
          </span>
        </span>
      </button>
    </article>
  )
}
