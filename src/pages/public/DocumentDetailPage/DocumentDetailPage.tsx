import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'

import { DownloadOutlined, LockOutlined } from '@ant-design/icons'
import { Alert, Avatar, Button, Card, Skeleton, Tag, Typography, message } from 'antd'

import { PageHeader } from '@/components/ui/PageHeader'
import { useDetail } from '@/hooks'
import type { Document } from '@/models/Document'
import { DocumentLicenseStatus } from '@/models/DocumentLicense'
import { FileSize } from '@/models/enum/FileSize'
import { RoutePath } from '@/routes'
import { getDocumentDetail } from '@/services/Document'
import { formatCurrency } from '@/utils/currency/formatCurrency'
import { formatFileSize } from '@/utils/file/formatFileSize'
import { getPublicUrl } from '@/utils/getPublicUrl'

const { Title, Text } = Typography

const resolveFileUrl = (document?: Document | null) => {
  if (!document?.file) return undefined

  if (document.file.url?.startsWith('http')) {
    return document.file.url
  }

  return getPublicUrl(document.file)
}

const resolvePreviewUrl = (document?: Document | null) => {
  if (!document?.preview) return undefined

  if (document.preview.url?.startsWith('http')) {
    return document.preview.url
  }

  return getPublicUrl(document.preview)
}

export const DocumentDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const requestDocumentDetail = useCallback(async (documentId: string) => {
    return getDocumentDetail({ id: documentId })
  }, [])

  const {
    data: document,
    error,
    isLoading,
    execute,
  } = useDetail<Document, string>(requestDocumentDetail, {
    immediate: false,
  })

  useEffect(() => {
    if (!id) return
    void execute(id)
  }, [execute, id])

  const isOwned =
    document?.price === 0 || document?.license?.status === DocumentLicenseStatus.ACTIVE || false

  const fileUrl = useMemo(() => resolveFileUrl(document), [document])
  const previewUrl = useMemo(() => resolvePreviewUrl(document), [document])

  const handleDownload = () => {
    if (!fileUrl) {
      message.warning('Chưa có tệp tải xuống khả dụng cho tài liệu này.')
      return
    }

    window.open(fileUrl, '_blank', 'noopener,noreferrer')
  }

  const handlePurchase = () => {
    message.info('Tính năng mua tài liệu sẽ sớm được cập nhật.')
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-300 px-4 py-8 lg:px-8">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    )
  }

  if (!id || !document) {
    return (
      <div className="mx-auto w-full max-w-300 px-4 py-8 lg:px-8">
        <Alert
          type="error"
          showIcon
          message="Không tìm thấy tài liệu"
          description={
            error instanceof Error
              ? error.message
              : 'Tài liệu không tồn tại hoặc bạn không có quyền truy cập.'
          }
        />
      </div>
    )
  }

  return (
    <div className="">
      <PageHeader
        title={document.title}
        breadcrumbItems={[
          { key: 'home', title: 'Trang chủ', href: '/' },
          { key: 'documents', title: 'Tài liệu', href: RoutePath.DocumentListPage.path },
        ]}
        showBackButton
        onBack={() => navigate(-1)}
      />

      <div className="flex gap-4">
        <section className="flex-1 space-y-4">
          <div className="flex gap-4">
            <Avatar
              size={200}
              shape="square"
              className="mb-4"
              src={getPublicUrl(document.thumbnail)}
            />

            <div className="">
              <p>Mô tả: {document.description || 'Tài liệu chưa có mô tả chi tiết.'}</p>
              <p>Tác giả: Nguyễn Văn A</p>
              <div className="flex gap-2 mt-4">
                <Tag>{document.category?.name}</Tag>
                <Tag>
                  {formatFileSize({
                    bytes: document.fileSize,
                    toUnit: FileSize.MB,
                  })}
                </Tag>
                {document.totalPages ? <Tag>{document.totalPages} trang</Tag> : null}
              </div>
            </div>
          </div>

          <div className="text-sm font-semibold">Tóm tắt:</div>

          <Card title="Phiên bản xem trước">
            {previewUrl ? (
              <iframe
                title="Document Preview"
                src={previewUrl}
                className="h-140 w-full rounded border border-slate-200"
              />
            ) : (
              <div className="flex h-70 flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-center">
                <LockOutlined className="mb-3 text-3xl text-slate-500" />
                <Text className="text-slate-700">Phiên bản xem trước không khả dụng</Text>
              </div>
            )}
          </Card>
        </section>

        <aside className="sticky top-24 basis-75">
          <Card className="">
            {isOwned ? (
              <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                Bạn đã sở hữu tài liệu này
              </div>
            ) : null}

            <div className="mb-5">
              <Text className="block text-sm text-slate-500">Giá tài liệu</Text>
              <Title level={2} className="mb-0! mt-1!">
                {formatCurrency({ value: document.price })}
              </Title>
            </div>

            <div className="mb-6 flex flex-col gap-3">
              {isOwned ? (
                <Button
                  type="primary"
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                >
                  Tải xuống PDF
                </Button>
              ) : (
                <Button type="primary" size="large" onClick={handlePurchase}>
                  Mua tài liệu
                </Button>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <Text className="text-slate-500">Dung lượng</Text>
                <Text className="font-medium text-slate-800">
                  {formatFileSize({ bytes: document.fileSize, toUnit: FileSize.MB })}
                </Text>
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-slate-500">Số trang</Text>
                <Text className="font-medium text-slate-800">{document.totalPages || 0} trang</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-slate-500">Định dạng</Text>
                <Text className="font-medium text-slate-800">PDF</Text>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
