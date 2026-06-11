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
    if (value.trim()) onSearch?.(value.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="w-full max-w-2xl">
      <div
        className="flex h-14 items-center overflow-hidden rounded-full bg-white"
        style={{
          boxShadow:
            '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(13, 148, 136, 0.08), inset 0 0 0 1px rgba(255,255,255,0.8)',
        }}
      >
        <div className="flex flex-1 items-center gap-3 pl-5 pr-2">
          <Search size={17} className="flex-shrink-0 text-teal-500" />
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
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
          className="m-1.5 flex h-11 items-center gap-2 rounded-full bg-teal-600 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-teal-700 active:scale-[0.97]"
          aria-label="Tìm kiếm"
        >
          <Search size={15} />
          <span>Tìm kiếm</span>
        </button>
      </div>
    </div>
  )
}

export default SearchBar
