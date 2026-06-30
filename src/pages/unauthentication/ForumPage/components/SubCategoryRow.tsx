import type { SubCategoryWithPreview } from '@/models/Forum'
import { MessageSquare } from 'lucide-react'
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

export const SubCategoryRow = ({ subCategory }: Props) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/forum/sub-categories/${subCategory.id}`)}
      className="flex cursor-pointer items-center gap-4 bg-white px-4 py-3 transition-colors hover:bg-neutral-1"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-1">
        <MessageSquare className="h-4 w-4 text-primary-7" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-semibold text-neutral-9">{subCategory.name}</p>
        {subCategory.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-neutral-5">{subCategory.description}</p>
        )}
      </div>

      <div className="hidden shrink-0 gap-6 text-center sm:flex">
        <div className="w-16">
          <p className="text-sm font-medium text-neutral-8">
            {subCategory.threadCount.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-4">Bài viết</p>
        </div>
        <div className="w-16">
          <p className="text-sm font-medium text-neutral-8">
            {subCategory.messageCount.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-4">Bình luận</p>
        </div>
      </div>

      <div className="hidden w-52 shrink-0 lg:block">
        {subCategory.latestThread ? (
          <div>
            <p className="line-clamp-1 text-xs font-medium text-neutral-7">
              {subCategory.latestThread.title}
            </p>
            <p className="mt-0.5 text-xs text-neutral-4">
              {subCategory.latestThread.lastReplyUser?.fullName ?? 'Ai đó'}
              {subCategory.latestThread.lastReplyAt
                ? ` · ${formatRelativeTime(subCategory.latestThread.lastReplyAt)}`
                : ''}
            </p>
          </div>
        ) : (
          <p className="text-xs text-neutral-3">Chưa có bài viết</p>
        )}
      </div>
    </div>
  )
}
