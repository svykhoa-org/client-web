import type { ForumCategoryGroup } from '@/models/Forum'
import { useState } from 'react'
import { SubCategoryRow } from './SubCategoryRow'

const PAGE_SIZE = 5

interface Props {
  group: ForumCategoryGroup
}

export const CategoryGroupSection = ({ group }: Props) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visibleSubCategories = group.subCategories.slice(0, visibleCount)
  const hasMore = visibleCount < group.subCategories.length

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-3">
      <div className="border-b border-neutral-3 bg-primary-1 px-4 py-2.5">
        <h2 className="text-sm font-bold text-primary-8">{group.name}</h2>
      </div>
      <div className="divide-y divide-neutral-2">
        {visibleSubCategories.map(sc => (
          <SubCategoryRow key={sc.id} subCategory={sc} />
        ))}
        {group.subCategories.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-neutral-4">Chưa có danh mục nào.</p>
        )}
      </div>
      {hasMore && (
        <div className="border-t border-neutral-2 bg-white px-4 py-2.5 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary-7 transition-colors hover:bg-primary-1 active:translate-y-px"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  )
}
