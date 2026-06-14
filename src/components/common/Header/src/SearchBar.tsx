import { useState } from 'react'

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  onSearch?: (value: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Nhập tên bệnh lý, triệu chứng hoặc khóa học...',
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

  return (
    <div className="w-full max-w-2xl">
      <div
        className="flex h-12 items-center overflow-hidden rounded-full bg-white sm:h-14"
        style={{
          boxShadow:
            '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(25, 118, 210, 0.08), inset 0 0 0 1px rgba(255,255,255,0.8)',
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 pl-4 pr-1 sm:gap-3 sm:pl-5 sm:pr-2">
          <Search size={17} className="flex-shrink-0 text-blue-500" />
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
          {value && (
            <button
              onClick={() => setValue('')}
              className="flex-shrink-0 rounded-full p-1 text-gray-300 transition-colors hover:text-gray-500"
              aria-label="Xóa nội dung"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="m-1 flex h-10 flex-shrink-0 items-center gap-2 rounded-full bg-primary-6 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-7 active:scale-[0.97] sm:m-1.5 sm:h-11 sm:px-6"
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
