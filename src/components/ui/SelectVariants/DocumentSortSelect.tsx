import { Select } from 'antd'

export type DocumentSortValue =
  | 'updatedAt:desc'
  | 'createdAt:asc'
  | 'price:asc'
  | 'price:desc'
  | 'title:asc'

interface DocumentSortSelectProps {
  value: DocumentSortValue
  onChange: (value: DocumentSortValue) => void
  className?: string
}

const sortOptions = [
  { label: 'Mới cập nhật', value: 'updatedAt:desc' },
  { label: 'Cũ nhất', value: 'createdAt:asc' },
  { label: 'Giá tăng dần', value: 'price:asc' },
  { label: 'Giá giảm dần', value: 'price:desc' },
  { label: 'Tiêu đề A-Z', value: 'title:asc' },
]

export const DocumentSortSelect = ({ value, onChange, className }: DocumentSortSelectProps) => {
  return (
    <Select
      size="middle"
      className={className}
      value={value}
      onChange={nextValue => onChange(nextValue as DocumentSortValue)}
      options={sortOptions}
    />
  )
}
