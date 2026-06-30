import type { ForumCategoryGroup } from '@/models/Forum'
import { SubCategoryCard } from './SubCategoryCard'

interface Props {
  group: ForumCategoryGroup
}

export const CategoryGroupSection = ({ group }: Props) => (
  <section>
    <div className="mb-3 flex items-center gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-5">{group.name}</h2>
      <div className="flex-1 border-t border-border" />
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {group.subCategories.map(sc => (
        <SubCategoryCard key={sc.id} subCategory={sc} />
      ))}
    </div>
  </section>
)
