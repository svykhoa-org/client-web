import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from 'antd'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderResultPageProps {
  status: 'success' | 'warning' | 'error'
  title: string
  subTitle: string
  primaryLabel: string
  primaryPath: string
  secondaryPath?: string
  secondaryLabel?: string
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
}: OrderResultPageProps) => {
  const navigate = useNavigate()
  const config = STATUS_CONFIG[status]

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
              {title}
            </h2>

            {/* Sub */}
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{subTitle}</p>

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
