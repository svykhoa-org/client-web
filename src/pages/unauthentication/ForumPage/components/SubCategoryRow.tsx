import type { SubCategoryWithPreview } from '@/models/Forum'
import { MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router'
import RouteConfig from '@/constants/RouteConfig'

interface Props {
  subCategory: SubCategoryWithPreview
}

export const SubCategoryRow = ({ subCategory }: Props) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(RouteConfig.ForumSubCategoryPage.path.replace(':id', subCategory.id))}
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
    </div>
  )
}
