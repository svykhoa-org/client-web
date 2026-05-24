/**
 * ComponentsPage — /components
 * Preview toàn bộ UI checkout & kết quả thanh toán dùng chung.
 */

import { CheckoutModalContent, type CheckoutData, OrderResultPage } from '@/components/payment'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_CHECKOUT_COURSE: CheckoutData = {
  checkoutUrl: '#',
  checkoutFields: {
    operation: 'PURCHASE',
    payment_method: 'BANK_TRANSFER',
    order_invoice_number: 'CORD0000000042',
    order_amount: 990000,
    currency: 'VND',
    order_description: 'Thanh toán khoá học: Siêu âm tim cơ bản',
    success_url: '/order/success',
    error_url: '/order/error',
    cancel_url: '/order/cancel',
    merchant: 'SP-LIVE-VB9232B9',
    signature: 'mock_signature_abc123',
  },
}

const MOCK_CHECKOUT_DOC: CheckoutData = {
  checkoutUrl: '#',
  checkoutFields: {
    operation: 'PURCHASE',
    payment_method: 'BANK_TRANSFER',
    order_invoice_number: 'DOC0000000203',
    order_amount: 199000,
    currency: 'VND',
    order_description: 'Thanh toán tài liệu: Phác đồ điều trị tim mạch 2024',
    success_url: '/document-order/success',
    error_url: '/document-order/error',
    cancel_url: '/document-order/cancel',
    merchant: 'SP-LIVE-VB9232B9',
    signature: 'mock_signature_doc456',
  },
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

const PreviewSection = ({
  title,
  label,
  children,
}: {
  title: string
  label: string
  children: React.ReactNode
}) => (
  <div className="mb-10">
    <div className="mb-4 flex items-baseline gap-3">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <code className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{label}</code>
    </div>
    <div>{children}</div>
  </div>
)

// ─── Page ─────────────────────────────────────────────────────────────────────

export const ComponentsPage = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-slate-900">UI Components — Thanh toán</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tất cả checkout & kết quả thanh toán đang dùng chung{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">CheckoutModalContent</code>{' '}
          và <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">OrderResultPage</code> từ{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
            src/components/payment/
          </code>
        </p>
      </div>

      {/* ── CHECKOUT MODAL ────────────────────────────────────────────────── */}
      <div className="mb-14">
        <div className="mb-6 border-b border-slate-200 pb-2">
          <h2 className="text-base font-bold text-slate-700">CheckoutModalContent</h2>
          <p className="text-xs text-slate-400">
            Dùng chung cho cả khoá học và tài liệu — mock data khác nhau
          </p>
        </div>

        <PreviewSection title="Checkout khoá học" label="CORD0000000042 · 990.000₫">
          <div className="max-w-sm rounded-lg border border-slate-100 bg-white p-6">
            <CheckoutModalContent checkoutData={MOCK_CHECKOUT_COURSE} />
          </div>
        </PreviewSection>

        <PreviewSection title="Checkout tài liệu" label="DOC0000000203 · 199.000₫">
          <div className="max-w-sm rounded-lg border border-slate-100 bg-white p-6">
            <CheckoutModalContent checkoutData={MOCK_CHECKOUT_DOC} />
          </div>
        </PreviewSection>
      </div>

      {/* ── ORDER RESULT PAGES ────────────────────────────────────────────── */}
      <div>
        <div className="mb-6 border-b border-slate-200 pb-2">
          <h2 className="text-base font-bold text-slate-700">OrderResultPage</h2>
          <p className="text-xs text-slate-400">
            Dùng chung cho khoá học và tài liệu — text & primaryPath khác nhau
          </p>
        </div>

        <PreviewSection title="Thành công — Khoá học" label="/order/success">
          <OrderResultPage
            status="success"
            title="Thanh toán thành công!"
            subTitle="Cảm ơn bạn đã mua khoá học. Bạn có thể bắt đầu học ngay bây giờ."
            primaryLabel="Xem khoá học của tôi"
            primaryPath="/courses"
          />
        </PreviewSection>

        <PreviewSection title="Thành công — Tài liệu" label="/document-order/success">
          <OrderResultPage
            status="success"
            title="Thanh toán thành công"
            subTitle="Tài liệu đã được kích hoạt trong tài khoản của bạn. Bạn có thể tải xuống ngay."
            primaryLabel="Xem danh sách tài liệu"
            primaryPath="/documents"
          />
        </PreviewSection>

        <PreviewSection title="Đã huỷ" label="/order/cancel · /document-order/cancel">
          <OrderResultPage
            status="warning"
            title="Đã huỷ thanh toán"
            subTitle="Giao dịch đã bị huỷ. Nếu bạn gặp vấn đề khi thanh toán, vui lòng thử lại."
            primaryLabel="Thử lại"
            primaryPath="/courses"
          />
        </PreviewSection>

        <PreviewSection title="Thất bại" label="/order/error · /document-order/error">
          <OrderResultPage
            status="error"
            title="Thanh toán thất bại"
            subTitle="Có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng thử lại sau hoặc liên hệ hỗ trợ."
            primaryLabel="Thử lại"
            primaryPath="/courses"
          />
        </PreviewSection>
      </div>
    </div>
  )
}
