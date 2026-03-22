import type { Category } from '@/models/Category';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

const CategorySidebar = ({ categories, selectedCategory, onCategorySelect }: CategorySidebarProps) => {
  return (
    <div className="bg-neutral-1 rounded-lg p-4">
      <h3 className="text-neutral-9 mb-4 text-lg font-semibold">Danh mục chuyên khoa</h3>
      <div className="space-y-2">
        {categories.map(category => (
          <button
            key={category._id}
            onClick={() => onCategorySelect?.(category?._id || '')}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
              selectedCategory === category._id
                ? 'bg-primary-6 text-white'
                : 'text-neutral-7 hover:bg-neutral-2 hover:text-neutral-9'
            }`}
          >
            <div className="font-medium">{category.name}</div>
            {category.description && <div className="mt-1 text-xs opacity-75">{category.description}</div>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
