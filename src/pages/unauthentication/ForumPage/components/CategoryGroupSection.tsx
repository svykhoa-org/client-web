import type { ForumCategoryGroup } from '@/models/Forum'
import { SubCategoryRow } from './SubCategoryRow'

interface Props {
  group: ForumCategoryGroup
}

export const CategoryGroupSection = ({ group }: Props) => (
  <div className="overflow-hidden rounded-lg border border-neutral-3">
    <div className="border-b border-neutral-3 bg-primary-1 px-4 py-2.5">
      <h2 className="text-sm font-bold text-primary-8">{group.name}</h2>
    </div>
    <div className="divide-y divide-neutral-2">
      {group.subCategories.map(sc => (
        <SubCategoryRow key={sc.id} subCategory={sc} />
      ))}
      {group.subCategories.length === 0 && (
        <p className="px-4 py-6 text-center text-sm text-neutral-4">Chưa có danh mục nào.</p>
      )}
    </div>
  </div>
)
