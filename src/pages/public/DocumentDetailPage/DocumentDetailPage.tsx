import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { DownloadOutlined, FileTextOutlined, LockOutlined } from '@ant-design/icons'
import { Alert, Button, Modal, Skeleton, Tag, message } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { PageHeader } from '@/components/ui/PageHeader'
import { useDetail, useRequest } from '@/hooks'
import { useAuth } from '@/hooks/useAuth'
import type { Document } from '@/models/Document'
import { DocumentLicenseStatus } from '@/models/DocumentLicense'
import { FileSize } from '@/models/enum/FileSize'
import { RoutePath } from '@/routes'
import { CheckoutModalContent, type CheckoutData } from '@/components/payment'
import {
  checkoutDocumentOrder,
  getDocumentDetail,
  getDocumentDownloadUrl,
} from '@/services/Document'
import { formatCurrency } from '@/utils/currency/formatCurrency'
import { formatFileSize } from '@/utils/file/formatFileSize'
import { getPublicUrl } from '@/utils/getPublicUrl'

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

const resolveThumbnailUrl = (document?: Document | null) => {
  if (!document?.thumbnail) return undefined

  if (document.thumbnail.url?.startsWith('http')) {
    return document.thumbnail.url
  }

  return getPublicUrl(document.thumbnail)
}

export const DocumentDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)

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

  const { execute: executeCheckout, isLoading: isCheckingOut } = useRequest(checkoutDocumentOrder)

  const { execute: executeDownloadUrl, isLoading: isPreparingDownload } =
    useRequest(getDocumentDownloadUrl)

  useEffect(() => {
    if (!id) return
    void execute(id)
  }, [execute, id])

  // Tài liệu 0đ KHÔNG còn mặc định sở hữu: phải qua popup để ghi nhận order + cấp license.
  const isOwned = document?.license?.status === DocumentLicenseStatus.ACTIVE || false
  const isFree = document?.price === 0

  const fileUrl = useMemo(() => resolveFileUrl(document), [document])
  const previewUrl = useMemo(() => resolvePreviewUrl(document), [document])
  const thumbnailUrl = useMemo(() => resolveThumbnailUrl(document), [document])

  const handleDownload = () => {
    if (!document?.id) {
      message.warning('Không tìm thấy thông tin tài liệu để tải xuống.')
      return
    }

    void (async () => {
      try {
        const response = await executeDownloadUrl({ documentId: document.id })

        if (response.downloadUrl) {
          window.open(response.downloadUrl, '_blank', 'noopener,noreferrer')
          return
        }

        if (fileUrl) {
          window.open(fileUrl, '_blank', 'noopener,noreferrer')
          return
        }

        message.warning('Chưa có tệp tải xuống khả dụng cho tài liệu này.')
      } catch (nextError) {
        const errorMessage =
          nextError instanceof Error
            ? nextError.message
            : 'Không thể chuẩn bị link tải xuống tài liệu.'
        message.error(errorMessage)
      }
    })()
  }

  const handlePurchase = () => {
    if (!document?.id) {
      message.warning('Không tìm thấy thông tin tài liệu để thanh toán.')
      return
    }

    if (!isAuthenticated) {
      const redirect = encodeURIComponent(window.location.pathname)
      navigate(`${RouteConfig.LoginPage.path}?redirect=${redirect}`)
      return
    }

    void (async () => {
      try {
        const checkoutData = await executeCheckout({
          documentId: document.id,
          successUrl: `${window.location.origin}${RoutePath.DocumentOrderSuccessPage.path}`,
          cancelUrl: `${window.location.origin}${RoutePath.DocumentOrderCancelPage.path}`,
          errorUrl: `${window.location.origin}${RoutePath.DocumentOrderErrorPage.path}`,
        })

        if (!checkoutData.checkoutUrl) {
          message.error('Không nhận được đường dẫn thanh toán từ hệ thống.')
          return
        }

        if (Object.keys(checkoutData.checkoutFields ?? {}).length === 0) {
          window.location.href = checkoutData.checkoutUrl
          return
        }

        setCheckoutData(checkoutData)
        setIsCheckoutModalOpen(true)
      } catch (nextError) {
        const rawMessage = nextError instanceof Error ? nextError.message : 'Thanh toán thất bại.'
        const normalizedMessage = rawMessage.toLowerCase()

        if (
          normalizedMessage.includes('không tồn tại') ||
          normalizedMessage.includes('not found')
        ) {
          message.error('Tài liệu không tồn tại.')
          return
        }

        if (normalizedMessage.includes('published') || normalizedMessage.includes('chưa bán')) {
          message.warning('Tài liệu chưa được phát hành để bán.')
          return
        }

        if (normalizedMessage.includes('active license') || normalizedMessage.includes('đã mua')) {
          message.info('Bạn đã sở hữu tài liệu này.')
          return
        }

        if (normalizedMessage.includes('401') || normalizedMessage.includes('unauthorized')) {
          const redirect = encodeURIComponent(window.location.pathname)
          navigate(`${RouteConfig.LoginPage.path}?redirect=${redirect}`)
          return
        }

        message.error(rawMessage)
      }
    })()
  }

  // Tài liệu 0đ: mở popup; xác nhận sẽ ghi nhận order + cấp license ngay.
  const openFreeModal = () => {
    if (!document) return
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(window.location.pathname)
      navigate(`${RouteConfig.LoginPage.path}?redirect=${redirect}`)
      return
    }
    setCheckoutData({
      checkoutUrl: '',
      checkoutFields: { order_description: document.title, order_amount: 0, currency: 'VND' },
      free: true,
    })
    setIsCheckoutModalOpen(true)
  }

  const handleConfirmFree = () => {
    if (!document?.id) return
    void (async () => {
      try {
        await executeCheckout({
          documentId: document.id,
          successUrl: `${window.location.origin}${RoutePath.DocumentOrderSuccessPage.path}`,
          cancelUrl: `${window.location.origin}${RoutePath.DocumentOrderCancelPage.path}`,
          errorUrl: `${window.location.origin}${RoutePath.DocumentOrderErrorPage.path}`,
        })
        setIsCheckoutModalOpen(false)
        message.success('Đăng ký tài liệu thành công')
        await execute(document.id)
      } catch (nextError) {
        const msg = nextError instanceof Error ? nextError.message : 'Đăng ký tài liệu thất bại.'
        message.error(msg)
      }
    })()
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
    <div className="pb-16 lg:pb-0">
      <PageHeader
        title={document.title}
        breadcrumbItems={[
          { key: 'home', title: 'Trang chủ', href: '/' },
          { key: 'documents', title: 'Tài liệu', href: RoutePath.DocumentListPage.path },
        ]}
        showBackButton
        onBack={() => navigate(-1)}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <section className="min-w-0 flex-1 space-y-6">
          {/* Overview */}
          <div className="rounded-xl border border-neutral-3 bg-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="bg-primary-1 mx-auto aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-lg sm:mx-0">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={`Bìa tài liệu ${document.title}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FileTextOutlined className="text-primary-5 text-3xl" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  {document.category?.name ? (
                    <Tag className="mr-0 rounded-md">{document.category.name}</Tag>
                  ) : null}
                  <Tag className="mr-0 rounded-md">
                    {formatFileSize({ bytes: document.fileSize ?? 0, toUnit: FileSize.MB })}
                  </Tag>
                  {document.totalPages ? (
                    <Tag className="mr-0 rounded-md">{document.totalPages} trang</Tag>
                  ) : null}
                </div>
                <p className="mt-4 max-w-prose leading-relaxed text-neutral-7 text-pretty">
                  {document.description || 'Tài liệu chưa có mô tả chi tiết.'}
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="overflow-hidden rounded-xl border border-neutral-3 bg-white">
            <div className="border-b border-neutral-2 px-5 py-4">
              <h2 className="font-semibold text-neutral-10">Xem trước tài liệu</h2>
            </div>
            <div className="p-4">
              {previewUrl ? (
                <iframe
                  title="Xem trước tài liệu"
                  src={previewUrl}
                  className="h-140 w-full rounded-lg border border-neutral-3"
                />
              ) : (
                <div className="flex h-70 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-3 bg-neutral-1 text-center">
                  <LockOutlined className="mb-3 text-3xl text-neutral-5" />
                  <p className="text-neutral-7">Phiên bản xem trước không khả dụng</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="hidden lg:block lg:sticky lg:top-20 lg:w-80 lg:self-start">
          <div className="shadow-primary-10/10 rounded-xl border border-neutral-3 bg-white p-6 shadow-md">
            {isOwned ? (
              <div className="bg-success-1 text-success-3 mb-4 rounded-lg px-3 py-2 text-center text-sm font-semibold">
                Bạn đã sở hữu tài liệu này
              </div>
            ) : null}

            <div className="mb-5">
              <p className="text-sm text-neutral-5">Giá tài liệu</p>
              {document.price === 0 ? (
                <p className="text-success-3 mt-1 text-3xl font-bold">Miễn phí</p>
              ) : (
                <p className="mt-1 text-3xl font-bold tabular-nums text-neutral-10">
                  {formatCurrency({ value: document.price })}
                </p>
              )}
            </div>

            <div className="mb-6">
              {isOwned ? (
                <Button
                  type="primary"
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  loading={isPreparingDownload}
                  block
                  className="h-12 font-semibold"
                >
                  Tải xuống PDF
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={isFree ? openFreeModal : handlePurchase}
                  loading={isCheckingOut}
                  block
                  className="h-12 font-semibold"
                >
                  {isFree ? 'Đăng ký miễn phí' : 'Mua tài liệu'}
                </Button>
              )}
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-6">Dung lượng</span>
                <span className="font-medium tabular-nums text-neutral-9">
                  {formatFileSize({ bytes: document.fileSize ?? 0, toUnit: FileSize.MB })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-6">Số trang</span>
                <span className="font-medium tabular-nums text-neutral-9">
                  {document.totalPages || 0} trang
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-6">Định dạng</span>
                <span className="font-medium text-neutral-9">PDF</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center gap-3 border-t border-neutral-3 bg-white px-4 lg:hidden">
        <div className="shrink-0">
          {document.price === 0 ? (
            <span className="text-success-3 text-base font-bold">Miễn phí</span>
          ) : isOwned ? (
            <span className="text-xs font-semibold text-success-3">Đã sở hữu</span>
          ) : (
            <span className="text-base font-bold tabular-nums text-neutral-10">
              {formatCurrency({ value: document.price })}
            </span>
          )}
        </div>
        <div className="flex-1">
          {isOwned ? (
            <Button
              type="primary"
              block
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              loading={isPreparingDownload}
              className="h-10 font-semibold"
            >
              Tải xuống PDF
            </Button>
          ) : (
            <Button
              type="primary"
              block
              onClick={isFree ? openFreeModal : handlePurchase}
              loading={isCheckingOut}
              className="h-10 font-semibold"
            >
              {isFree ? 'Đăng ký miễn phí' : 'Mua tài liệu'}
            </Button>
          )}
        </div>
      </div>

      <Modal
        title="Thanh toán tài liệu"
        open={isCheckoutModalOpen}
        onCancel={() => setIsCheckoutModalOpen(false)}
        footer={null}
        width={960}
        destroyOnClose
      >
        {checkoutData ? (
          <CheckoutModalContent
            checkoutData={checkoutData}
            onConfirmFree={handleConfirmFree}
            confirmingFree={isCheckingOut}
          />
        ) : null}
      </Modal>
    </div>
  )
}
