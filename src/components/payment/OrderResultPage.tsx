import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'

import { getOrderPaymentStatus } from '@/services/Order/paymentStatus'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderResultPageProps {
  status: 'success' | 'warning' | 'error'
  title: string
  subTitle: string
  primaryLabel: string
  primaryPath: string
  secondaryPath?: string
  secondaryLabel?: string
  verifyPayment?: boolean
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  success: {
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
    badgeLabel: 'Hoàn tất',
    hint: 'Giao dịch của bạn đã được xử lý thành công.',
  },
  warning: {
    bar: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700',
    badgeLabel: 'Đã huỷ',
    hint: 'Không có khoản tiền nào bị trừ khỏi tài khoản của bạn.',
  },
  error: {
    bar: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700',
    badgeLabel: 'Thất bại',
    hint: 'Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề tiếp diễn.',
  },
  processing: {
    bar: 'bg-primary',
    badge: 'bg-primary-1 text-primary',
    badgeLabel: 'Đang xử lý',
    hint: 'Trang sẽ tự cập nhật khi hệ thống xác nhận thanh toán và cấp quyền.',
  },
} as const

// ─── Component ────────────────────────────────────────────────────────────────

export const OrderResultPage = ({
  status,
  title,
  subTitle,
  primaryLabel,
  primaryPath,
  secondaryPath = '/',
  secondaryLabel = 'Về trang chủ',
  verifyPayment = false,
}: OrderResultPageProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [startedAt] = useState(() => Date.now())
  const paymentQuery = useQuery({
    queryKey: ['order-payment-status', orderId],
    queryFn: () => getOrderPaymentStatus(orderId!),
    enabled: verifyPayment && !!orderId,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: query => {
      const payment = query.state.data
      if (
        payment?.fulfillment.status === 'FULFILLED' ||
        payment?.fulfillment.status === 'FAILED' ||
        payment?.payment.status === 'EXPIRED' ||
        payment?.payment.status === 'CANCELLED'
      ) {
        return false
      }
      if (document.hidden || !navigator.onLine) return false
      return Date.now() - startedAt < 30_000 ? 2_000 : 5_000 + Math.floor(Math.random() * 1_000)
    },
  })
  const authoritative = paymentQuery.data
  const confirmed = authoritative?.fulfillment.status === 'FULFILLED'
  const failed =
    !orderId ||
    paymentQuery.isError ||
    authoritative?.fulfillment.status === 'FAILED' ||
    authoritative?.payment.status === 'EXPIRED' ||
    authoritative?.payment.status === 'CANCELLED'
  const displayStatus = verifyPayment
    ? confirmed
      ? 'success'
      : failed
        ? 'error'
        : 'processing'
    : status
  const config = STATUS_CONFIG[displayStatus]
  const displayTitle = verifyPayment
    ? confirmed
      ? title
      : failed
        ? 'Không thể hoàn tất đơn hàng'
        : authoritative?.payment.status === 'PAID'
          ? 'Đã nhận thanh toán, đang cấp quyền'
          : 'Đang xác nhận thanh toán'
    : title
  const displaySubTitle = verifyPayment
    ? confirmed
      ? subTitle
      : orderId
        ? `Đơn hàng ${authoritative?.order.orderCode ?? orderId} chưa hoàn tất. Vui lòng giữ trang này mở.`
        : 'Thiếu mã đơn hàng để xác minh. Vui lòng mở lịch sử đơn hàng hoặc liên hệ hỗ trợ.'
    : subTitle

  // Entrance animation
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex min-h-[72vh] items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-sm"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        {/* Card */}
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          {/* Status bar */}
          <div className={`h-1 w-full ${config.bar}`} />

          {/* Content */}
          <div className="px-8 py-8">
            {/* Badge */}
            <span
              className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${config.badge}`}
            >
              {config.badgeLabel}
            </span>

            {/* Title */}
            <h2 className="mt-4 text-[22px] font-bold leading-snug tracking-tight text-slate-900">
              {displayTitle}
            </h2>

            {/* Sub */}
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{displaySubTitle}</p>

            {/* Hint line */}
            <p className="mt-1 text-xs text-slate-400">{config.hint}</p>

            {/* Divider */}
            <div className="my-6 border-t border-slate-100" />

            {/* Actions */}
            <div className="space-y-3">
              <Button
                type="primary"
                block
                size="large"
                className="rounded-lg font-medium"
                onClick={() => navigate(primaryPath)}
              >
                {primaryLabel}
              </Button>

              <button
                type="button"
                onClick={() => navigate(secondaryPath)}
                className="w-full py-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
              >
                {secondaryLabel}
              </button>
            </div>
          </div>

          {/* Footer strip */}
          <div className="border-t border-slate-50 bg-slate-50 px-8 py-3">
            <p className="text-center text-[11px] text-slate-300">
              Giao dịch được xử lý bởi SePay · Được mã hóa & bảo mật
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
