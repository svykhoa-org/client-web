import type { Category } from '@/models/Category'

interface CategorySidebarProps {
  categories: Category[]
  selectedCategory?: string
  onCategorySelect?: (categoryId: string) => void
}

const CategorySidebar = ({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategorySidebarProps) => {
  const isAllSelected = !selectedCategory

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-3/60 bg-white">
      <div className="border-b border-neutral-3/60 px-4 py-3">
        <h3 className="text-sm font-semibold text-neutral-9">Chuyên khoa</h3>
      </div>

      <div className="p-2">
        <button
          onClick={() => onCategorySelect?.('')}
          className={`relative w-full overflow-hidden rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 ${
            isAllSelected
              ? 'bg-primary-1 font-semibold text-primary-7'
              : 'text-neutral-7 hover:bg-neutral-2/60 hover:text-neutral-9'
          }`}
        >
          {isAllSelected && (
            <span className="absolute left-0 top-0 h-full w-0.5 rounded-r-full bg-primary-6" />
          )}
          <span className={isAllSelected ? 'pl-1' : ''}>Tất cả chuyên khoa</span>
        </button>

        {categories.map(category => {
          const isActive = selectedCategory === category.id
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect?.(category?.id || '')}
              className={`relative mt-0.5 w-full overflow-hidden rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-primary-1 font-semibold text-primary-7'
                  : 'text-neutral-7 hover:bg-neutral-2/60 hover:text-neutral-9'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-0.5 rounded-r-full bg-primary-6" />
              )}
              <div className={isActive ? 'pl-1' : ''}>
                <div className="leading-snug">{category.name}</div>
                {category.description && (
                  <div className="mt-0.5 line-clamp-1 text-xs opacity-60">
                    {category.description}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategorySidebar
