import { Skeleton } from 'antd'

interface DocumentListSkeletonProps {
  count?: number
}

export const DocumentListSkeleton = ({ count = 4 }: DocumentListSkeletonProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`document-skeleton-${index}`}
          className="flex gap-4 rounded-xl border border-neutral-3 bg-white p-4 sm:gap-5 sm:p-5"
        >
          <Skeleton.Image active className="!h-28 !w-20 shrink-0 !rounded-lg sm:!w-24" />
          <div className="flex-1">
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: '62%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
