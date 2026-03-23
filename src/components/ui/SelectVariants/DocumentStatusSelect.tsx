import { Select } from 'antd'

export type DocumentStatusSelectValue = 'all' | 'PUBLISHED' | 'DRAFT'

interface DocumentStatusSelectProps {
  value: DocumentStatusSelectValue
  onChange: (value: DocumentStatusSelectValue) => void
  className?: string
}

const statusOptions = [
  { label: 'Trạng thái', value: 'all' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
]

export const DocumentStatusSelect = ({ value, onChange, className }: DocumentStatusSelectProps) => {
  return (
    <Select
      size="middle"
      className={className}
      value={value}
      onChange={value => onChange(value as DocumentStatusSelectValue)}
      options={statusOptions}
    />
  )
}
