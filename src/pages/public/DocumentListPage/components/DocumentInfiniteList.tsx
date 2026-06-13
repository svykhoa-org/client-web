import { type RefObject } from 'react'

import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons'
import { Alert, Button, Spin } from 'antd'

import type { Document } from '@/models/Document'

import { DocumentCard } from './DocumentCard'
import { DocumentListEmpty } from './DocumentListEmpty'
import { DocumentListSkeleton } from './DocumentListSkeleton'

interface DocumentInfiniteListProps {
  documents: Document[]
  loadingInitial: boolean
  loadingMore: boolean
  hasNextPage: boolean
  errorMessage: string | null
  searchKeyword: string
  sentinelRef: RefObject<HTMLDivElement | null>
  onRetry: () => void
}

export const DocumentInfiniteList = ({
  documents,
  loadingInitial,
  loadingMore,
  hasNextPage,
  errorMessage,
  searchKeyword,
  sentinelRef,
  onRetry,
}: DocumentInfiniteListProps) => {
  if (loadingInitial) {
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
      {documents.map(document => (
        <DocumentCard key={document.id} document={document} />
      ))}

      {errorMessage ? (
        <Alert
          type="warning"
          showIcon
          message="Có lỗi khi tải thêm dữ liệu"
          description={errorMessage}
          action={
            <Button size="small" onClick={onRetry}>
              Tải lại
            </Button>
          }
        />
      ) : null}

      {loadingMore ? (
        <div className="flex items-center justify-center py-3 text-neutral-6">
          <Spin indicator={<LoadingOutlined spin />} />
          <span className="ml-2 text-sm">Đang tải thêm tài liệu...</span>
        </div>
      ) : null}

      <div ref={sentinelRef} className="h-1 w-full" />

      {!hasNextPage && documents.length > 0 ? (
        <p className="py-2 text-center text-sm text-neutral-5">
          Bạn đã xem hết danh sách tài liệu.
        </p>
      ) : null}
    </div>
  )
}
