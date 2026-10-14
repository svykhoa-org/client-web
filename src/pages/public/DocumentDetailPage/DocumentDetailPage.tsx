import { useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react'
import { useNavigate, useParams } from 'react-router'

import {
  CheckCircleFilled,
  DownloadOutlined,
  LockOutlined,
  PlayCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { Alert, Button, Modal, Skeleton, message } from 'antd'
import dayjs from 'dayjs'

import RouteConfig from '@/constants/RouteConfig'
import { PageHeader } from '@/components/ui/PageHeader'
import { WatermarkedVideoPlayer } from '@/components/WatermarkedVideoPlayer/WatermarkedVideoPlayer'
import { useDetail, useRequest } from '@/hooks'
import { useAuth } from '@/hooks/useAuth'
import { DocumentKind, type Document } from '@/models/Document'
import { DocumentLicenseStatus } from '@/models/DocumentLicense'
import { FileSize } from '@/models/enum/FileSize'
import { RoutePath } from '@/routes'
import { CheckoutModalContent, type CheckoutData } from '@/components/payment'
import {
  checkoutDocumentOrder,
  getDocumentDetail,
  getDocumentDownloadUrl,
} from '@/services/Document'
import { waitForOrderFulfillment } from '@/services/Order/paymentStatus'
import { formatCurrency } from '@/utils/currency/formatCurrency'
import { formatFileSize } from '@/utils/file/formatFileSize'
import { getPublicUrl } from '@/utils/getPublicUrl'

// Fallback bìa tài liệu — asset tĩnh trong public/, dùng khi thiếu thumbnail
// hoặc ảnh lỗi (đồng bộ với DocumentCard ở trang list).
const PLACEHOLDER_THUMBNAIL = '/document-placeholder.png'

const resolvePreviewUrl = (document?: Document | null) => getPublicUrl(document?.preview)

const resolveThumbnailUrl = (document?: Document | null) =>
  getPublicUrl(document?.thumbnail) ?? PLACEHOLDER_THUMBNAIL

const handleThumbnailError = (event: SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget
  if (img.dataset.fallback) return
  img.dataset.fallback = 'true'
  img.src = PLACEHOLDER_THUMBNAIL
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
  const isVideo = document?.kind === DocumentKind.VIDEO
  const playerSectionRef = useRef<HTMLDivElement>(null)

  // Video documents are watched in-page (no download); the CTA just brings the
  // player into view.
  const handleWatch = () => {
    playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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

        // Only the watermarked, license-gated copy from the server is a valid
        // download. There is intentionally no fallback to the original file url
        // — the server no longer exposes it (watermark/trace would be bypassed).
        if (response.downloadUrl) {
          window.open(response.downloadUrl, '_blank', 'noopener,noreferrer')
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
        const checkout = await executeCheckout({
          documentId: document.id,
          successUrl: `${window.location.origin}${RoutePath.DocumentOrderSuccessPage.path}`,
          cancelUrl: `${window.location.origin}${RoutePath.DocumentOrderCancelPage.path}`,
          errorUrl: `${window.location.origin}${RoutePath.DocumentOrderErrorPage.path}`,
        })
        const orderId = checkout.order?.id
        if (orderId) {
          const status = await waitForOrderFulfillment(orderId)
          if (status.fulfillment.status !== 'FULFILLED') {
            setIsCheckoutModalOpen(false)
            message.info('Đơn hàng đang được xử lý. Quyền tải sẽ được cập nhật sau ít phút.')
            return
          }
        }
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
        breadcrumbItems={[
          { key: 'home', title: 'Trang chủ', href: '/' },
          { key: 'documents', title: 'Tài liệu', href: RoutePath.DocumentListPage.path },
          ...(document.category?.name ? [{ key: 'category', title: document.category.name }] : []),
        ]}
        showBackButton
        onBack={() => navigate(-1)}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <section className="min-w-0 flex-1 space-y-6">
          {/* Overview */}
          <div className="rounded-xl border border-neutral-3 bg-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="bg-primary-1 mx-auto aspect-square w-40 shrink-0 overflow-hidden rounded-lg sm:mx-0">
                <img
                  src={thumbnailUrl}
                  alt={`Bìa tài liệu ${document.title}`}
                  onError={handleThumbnailError}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold leading-snug text-neutral-10">
                  {document.title}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2">
                  {isVideo ? (
                    document.durationMinutes ? (
                      <span className="bg-primary-1 text-primary-8 rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums">
                        {document.durationMinutes} phút
                      </span>
                    ) : null
                  ) : (
                    <span className="bg-primary-1 text-primary-8 rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums">
                      {formatFileSize({ bytes: document.fileSize ?? 0, toUnit: FileSize.MB })}
                    </span>
                  )}
                  {!isVideo && document.totalPages ? (
                    <span className="bg-primary-1 text-primary-8 rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums">
                      {document.totalPages} trang
                    </span>
                  ) : null}
                  <span className="bg-primary-1 text-primary-8 rounded-md px-2.5 py-1 text-xs font-semibold">
                    {isVideo ? 'Video' : 'PDF'}
                  </span>
                </div>

                <dl className="mt-4 flex gap-2 text-sm">
                  <dt className="text-neutral-5">Ngày phát hành:</dt>
                  <dd className="font-medium text-neutral-8 tabular-nums">
                    {dayjs(document.createdAt).format('DD/MM/YYYY')}
                  </dd>
                </dl>
              </div>
            </div>

            {/* Description — full width below */}
            <p className="mt-5 font-light leading-relaxed text-neutral-7 text-pretty">
              {document.description || 'Tài liệu chưa có mô tả chi tiết.'}
            </p>
          </div>

          {/* Video player (owned) / locked placeholder */}
          {isVideo ? (
            <div
              ref={playerSectionRef}
              className="overflow-hidden rounded-xl border border-neutral-3 bg-white"
            >
              <div className="border-b border-neutral-2 px-5 py-4">
                <h2 className="font-semibold text-neutral-10">Xem video</h2>
              </div>
              <div className="p-4">
                {isOwned ? (
                  <WatermarkedVideoPlayer documentId={document.id} />
                ) : (
                  <div className="flex h-70 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-3 bg-neutral-1 text-center">
                    <LockOutlined className="mb-3 text-3xl text-neutral-5" />
                    <p className="text-neutral-7">Mua tài liệu để xem video này</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Preview (PDF only) */}
          {!isVideo ? (
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
          ) : null}
        </section>

        <aside className="hidden lg:block lg:sticky lg:top-20 lg:w-80 lg:self-start">
          <div className="shadow-primary-10/10 rounded-xl border border-neutral-3 bg-white p-6 shadow-md">
            {isOwned ? (
              <div className="bg-success-1 text-success-3 mb-4 rounded-lg px-3 py-2 text-center text-sm font-semibold">
                Bạn đã sở hữu tài liệu này
              </div>
            ) : null}

            <div className="mb-1">
              <p className="text-sm text-neutral-5">Giá tài liệu</p>
              {isFree ? (
                <p className="text-success-3 mt-1 text-3xl font-bold">Miễn phí</p>
              ) : (
                <p className="mt-1 text-3xl font-bold tabular-nums text-neutral-10">
                  {formatCurrency({ value: document.price })}
                </p>
              )}
            </div>
            <p className="mb-5 text-xs text-neutral-5">
              {isFree
                ? 'Đăng ký một lần • Truy cập trọn đời'
                : 'Thanh toán một lần • Sở hữu trọn đời'}
            </p>

            <div className="mb-6">
              {isOwned ? (
                <Button
                  type="primary"
                  size="large"
                  icon={isVideo ? <PlayCircleOutlined /> : <DownloadOutlined />}
                  onClick={isVideo ? handleWatch : handleDownload}
                  loading={isVideo ? false : isPreparingDownload}
                  block
                  className="h-12 font-semibold"
                >
                  {isVideo ? 'Xem video' : 'Tải xuống PDF'}
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

            {/* Value props — bám hành vi thật: download watermarked, sở hữu vĩnh viễn */}
            <ul className="space-y-2.5 text-[13px] text-neutral-7">
              <li className="flex items-start gap-2.5">
                <CheckCircleFilled className="text-success-3 mt-0.5 shrink-0" />
                <span>
                  {isVideo
                    ? 'Xem trực tuyến, gắn watermark theo tài khoản của bạn'
                    : 'PDF có watermark bảo vệ bản quyền'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircleFilled className="text-success-3 mt-0.5 shrink-0" />
                <span>{isVideo ? 'Xem lại trọn đời' : 'Truy cập & tải lại trọn đời'}</span>
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-2 border-t border-neutral-2 pt-4 text-xs text-neutral-5">
              <SafetyCertificateOutlined className="text-primary-6" />
              <span>Thanh toán an toàn qua SePay</span>
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
              icon={isVideo ? <PlayCircleOutlined /> : <DownloadOutlined />}
              onClick={isVideo ? handleWatch : handleDownload}
              loading={isVideo ? false : isPreparingDownload}
              className="h-10 font-semibold"
            >
              {isVideo ? 'Xem video' : 'Tải xuống PDF'}
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
