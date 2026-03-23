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
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <Skeleton active paragraph={{ rows: 3 }} title={{ width: '78%' }} />
        </div>
      ))}
    </div>
  )
}
