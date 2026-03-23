import { Select } from 'antd'

import { useList } from '@/hooks'
import type { DocumentClassify } from '@/models/DocumentClassify'
import { type ListDocumentClassifyInput, listDocumentClassify } from '@/services/DocumentClassify'

interface DocumentClassifySelectProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const INITIAL_CLASSIFY_PARAMS: ListDocumentClassifyInput = {
  page: 1,
  pageSize: 500,
  sorter: {
    field: 'name',
    direction: 'asc',
  },
}

export const DocumentClassifySelect = ({
  value,
  onChange,
  className,
}: DocumentClassifySelectProps) => {
  const { items, isLoading } = useList<DocumentClassify, ListDocumentClassifyInput>(
    listDocumentClassify,
    {
      initialParams: INITIAL_CLASSIFY_PARAMS,
    },
  )

  const options = [
    { label: 'Tất cả danh mục', value: '' },
    ...items.map(item => ({
      label: item.name,
      value: item.id,
    })),
  ]

  return (
    <Select
      size="middle"
      className={className}
      value={value}
      onChange={onChange}
      loading={isLoading}
      options={options}
    />
  )
}
