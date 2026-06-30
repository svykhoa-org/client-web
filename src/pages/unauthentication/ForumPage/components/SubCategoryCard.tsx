import type { SubCategoryWithPreview } from '@/models/Forum'
import { MessageSquare, FileText, Clock } from 'lucide-react'
import { useNavigate } from 'react-router'

interface Props {
  subCategory: SubCategoryWithPreview
}

const formatRelativeTime = (dateStr: string | null): string => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}

export const SubCategoryCard = ({ subCategory }: Props) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/forum/sub-categories/${subCategory.id}`)}
      className="flex flex-col gap-2 rounded-lg border border-border bg-white p-4 cursor-pointer transition-shadow hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-neutral-9 line-clamp-1">{subCategory.name}</h3>
      </div>

      {subCategory.description && (
        <p className="text-xs text-neutral-5 line-clamp-2">{subCategory.description}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-neutral-5 mt-auto pt-1">
        <span className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {subCategory.threadCount.toLocaleString()} bài
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {subCategory.messageCount.toLocaleString()} bình luận
        </span>
      </div>

      {subCategory.latestThread && (
        <div className="border-t border-border pt-2 mt-1">
          <p className="text-xs text-neutral-7 line-clamp-1 font-medium">
            {subCategory.latestThread.title}
          </p>
          <div className="flex items-center gap-1 text-xs text-neutral-4 mt-0.5">
            <Clock className="h-3 w-3" />
            <span>
              {subCategory.latestThread.lastReplyUser?.fullName ?? 'Ai đó'}
              {subCategory.latestThread.lastReplyAt
                ? ` · ${formatRelativeTime(subCategory.latestThread.lastReplyAt)}`
                : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
