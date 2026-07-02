import type { ForumThread } from '@/models/Forum'
import { Eye, Clock, Pin, Lock } from 'lucide-react'
import { useNavigate } from 'react-router'

interface Props {
  thread: ForumThread
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const ThreadListItem = ({ thread }: Props) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/forum/threads/${thread.id}`)}
      className="flex items-start gap-3 rounded-lg border border-neutral-3 bg-white p-4 cursor-pointer transition-shadow hover:shadow-sm"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {thread.isPinned && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary-1 px-1.5 py-0.5 text-xs font-medium text-primary-7">
              <Pin className="h-3 w-3" />
              Ghim
            </span>
          )}
          {thread.isLocked && (
            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-2 px-1.5 py-0.5 text-xs text-neutral-5">
              <Lock className="h-3 w-3" />
              Đã khóa
            </span>
          )}
          {thread.prefixTag && (
            <span
              className="rounded-md px-1.5 py-0.5 text-xs font-medium text-white bg-[var(--badge-bg)]"
              style={{ '--badge-bg': thread.prefixTag.colorHex } as React.CSSProperties}
            >
              {thread.prefixTag.name}
            </span>
          )}
          <h3 className="text-sm font-semibold text-neutral-9 line-clamp-1">{thread.title}</h3>
        </div>
        <p className="mt-1 text-xs text-neutral-5">
          {thread.author?.fullName ?? 'Ẩn danh'}
          {thread.lastReplyAt && ` · Trả lời lần cuối ${formatDate(thread.lastReplyAt)}`}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-neutral-4">
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {thread.viewCount.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDate(thread.createdAt)}
        </span>
      </div>
    </div>
  )
}
