import { useState } from 'react'

import { Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'

interface SearchBarProps {
  onSearch?: (value: string) => void
  placeholder?: string
  /**
   * `hero` — large pill for the home hero (default, unchanged behavior).
   * `header` — compact pill embedded in the site header.
   */
  variant?: 'hero' | 'header'
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Nhập tên bệnh lý, triệu chứng...',
  variant = 'hero',
}) => {
  const [value, setValue] = useState('')

  const handleSearch = () => {
    if (!value.trim()) return
    onSearch?.(value.trim())
    // Clear the field after submit: the query is surfaced elsewhere (e.g. as the
    // results heading on /search), so keeping it in the input is redundant.
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const isHeader = variant === 'header'

  return (
    <div className={cn('w-full', !isHeader && 'max-w-2xl')}>
      <div
        className={cn(
          'flex items-center overflow-hidden rounded-full bg-white',
          isHeader
            ? 'h-10 border border-neutral-3 shadow-sm focus-within:border-primary-5'
            : 'h-12 sm:h-14',
        )}
        style={
          isHeader
            ? undefined
            : {
                boxShadow:
                  '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(25, 118, 210, 0.08), inset 0 0 0 1px rgba(255,255,255,0.8)',
              }
        }
      >
        <div
          className={cn(
            'flex min-w-0 flex-1 items-center',
            isHeader ? 'gap-2 pl-4 pr-1' : 'gap-2 pl-4 pr-1 sm:gap-3 sm:pl-5 sm:pr-2',
          )}
        >
          <Search size={isHeader ? 16 : 17} className="text-primary-5 shrink-0" />
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-neutral-9 outline-none placeholder:text-neutral-5"
          />
          {value && (
            <button
              onClick={() => setValue('')}
              className="shrink-0 rounded-full p-1 text-neutral-4 transition-colors hover:text-neutral-6"
              aria-label="Xóa nội dung"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className={cn(
            'bg-primary-6 hover:bg-primary-7 flex shrink-0 items-center gap-2 rounded-full font-semibold text-white transition-all duration-200 active:scale-[0.97]',
            isHeader ? 'm-1 h-8 px-3.5 text-sm' : 'm-1 h-10 px-4 text-sm sm:m-1.5 sm:h-11 sm:px-6',
          )}
          aria-label="Tìm kiếm"
        >
          <Search size={15} />
          <span className="hidden sm:inline">Tìm kiếm</span>
        </button>
      </div>
    </div>
  )
}

export default SearchBar
