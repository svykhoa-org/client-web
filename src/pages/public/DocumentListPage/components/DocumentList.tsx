import { ReloadOutlined } from '@ant-design/icons'
import { Alert, Button } from 'antd'

import Pagination from '@/components/ui/Pagination'
import type { Document } from '@/models/Document'

import { DocumentCard } from './DocumentCard'
import { DocumentListEmpty } from './DocumentListEmpty'
import { DocumentListSkeleton } from './DocumentListSkeleton'

interface DocumentListProps {
  documents: Document[]
  loading: boolean
  errorMessage: string | null
  searchKeyword: string
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onRetry: () => void
}

export const DocumentList = ({
  documents,
  loading,
  errorMessage,
  searchKeyword,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onRetry,
}: DocumentListProps) => {
  // Skeleton chỉ khi chưa có dữ liệu (initial / đổi filter về rỗng); khi đổi
  // trang, danh sách cũ được giữ tới khi trang mới về để tránh nháy layout.
  if (loading && documents.length === 0) {
    return <DocumentListSkeleton count={5} />
  }

  if (errorMessage && documents.length === 0) {
    return (
      <div className="space-y-4">
        <Alert
          type="error"
          message="Không thể tải dữ liệu tài liệu"
          description={errorMessage}
          showIcon
        />
        <Button icon={<ReloadOutlined />} onClick={onRetry}>
          Thử lại
        </Button>
      </div>
    )
  }

  if (documents.length === 0) {
    return <DocumentListEmpty keyword={searchKeyword} />
  }

  return (
    <div className="space-y-4">
      <div className={`space-y-4 transition-opacity ${loading ? 'opacity-60' : ''}`}>
        {documents.map(document => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>

      {errorMessage ? (
        <Alert
          type="warning"
          showIcon
          message="Có lỗi khi tải dữ liệu"
          description={errorMessage}
          action={
            <Button size="small" onClick={onRetry}>
              Tải lại
            </Button>
          }
        />
      ) : null}

      {totalItems > 0 ? (
        <div className="flex justify-center pt-2">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
      ) : null}
    </div>
  )
}
