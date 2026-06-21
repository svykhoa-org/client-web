import { useEffect, useRef, useState } from 'react'

import { Button } from 'antd'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Các field Sepay trả về trong checkoutFields */
export interface SepayCheckoutFields extends Record<
  string,
  string | number | boolean | null | undefined
> {
  operation?: string
  payment_method?: string
  order_invoice_number?: string
  order_amount?: number
  currency?: string
  order_description?: string
  success_url?: string
  error_url?: string
  cancel_url?: string
  merchant?: string
  signature?: string
}

export interface CheckoutData {
  checkoutUrl: string
  checkoutFields: SepayCheckoutFields
  /** Đơn 0đ: bấm "Thanh toán ngay" sẽ ghi nhận order + cấp quyền ngay, không qua SePay. */
  free?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number, currency = 'VND') =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(amount)

const toInputValue = (v: string | number | boolean | null | undefined): string =>
  v === null || v === undefined ? '' : String(v)

// ─── Component ────────────────────────────────────────────────────────────────

interface CheckoutModalContentProps {
  checkoutData: CheckoutData
  /** Bắt buộc khi checkoutData.free — xử lý xác nhận đơn 0đ. */
  onConfirmFree?: () => void
  confirmingFree?: boolean
}

export const CheckoutModalContent = ({
  checkoutData,
  onConfirmFree,
  confirmingFree,
}: CheckoutModalContentProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { checkoutUrl, checkoutFields, free } = checkoutData

  // Entrance animation
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [])

  const invoice =
    typeof checkoutFields.order_invoice_number === 'string'
      ? checkoutFields.order_invoice_number
      : '—'

  const description =
    typeof checkoutFields.order_description === 'string'
      ? checkoutFields.order_description
      : 'Thanh toán đơn hàng'

  const amount = typeof checkoutFields.order_amount === 'number' ? checkoutFields.order_amount : 0
  const currency = typeof checkoutFields.currency === 'string' ? checkoutFields.currency : 'VND'

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* Status bar */}
      <div className="h-1 w-full rounded-t-xl bg-blue-500" />

      {/* Body */}
      <div className="px-6 py-6">
        {/* Badge + heading */}
        <div className="mb-5">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-blue-600">
            Xác nhận đơn hàng
          </span>
          <p className="mt-3 text-[11px] text-slate-400">
            Kiểm tra thông tin bên dưới trước khi chuyển đến cổng thanh toán.
          </p>
        </div>

        {/* Order details */}
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-100">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-slate-400">Mã đơn hàng</span>
            <span className="font-mono text-sm font-semibold text-slate-800">{invoice}</span>
          </div>
          <div className="flex items-start justify-between gap-4 px-4 py-3">
            <span className="shrink-0 text-xs text-slate-400">Nội dung</span>
            <span className="text-right text-sm text-slate-700">{description}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-slate-400">Tổng tiền</span>
            <span className="text-base font-bold text-slate-900">
              {free ? 'Miễn phí' : formatCurrency(amount, currency)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-slate-100" />

        {free ? (
          <Button
            type="primary"
            size="large"
            block
            loading={confirmingFree}
            onClick={onConfirmFree}
            className="rounded-lg font-medium"
          >
            Thanh toán ngay
          </Button>
        ) : (
          /* Form */
          <form ref={formRef} action={checkoutUrl} method="POST">
            {Object.entries(checkoutFields).map(([field, value]) => (
              <input key={field} type="hidden" name={field} value={toInputValue(value)} />
            ))}

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="rounded-lg font-medium"
            >
              Thanh toán ngay
            </Button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="rounded-b-xl border-t border-slate-50 bg-slate-50 px-6 py-3">
        <p className="text-center text-[11px] text-slate-300">
          {free
            ? 'Khoá học/tài liệu miễn phí · Đăng ký để bắt đầu ngay'
            : 'Giao dịch được mã hóa và xử lý bởi SePay · Không lưu thông tin thẻ'}
        </p>
      </div>
    </div>
  )
}
