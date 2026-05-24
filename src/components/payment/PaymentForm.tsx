import { useEffect, useRef, useState } from 'react'

import { Button, Card, Spin, message } from 'antd'

import type { PaymentCheckoutData } from '@/models/Payment'
import { type CreatePaymentCheckoutParams, paymentService } from '@/services/payment'

interface PaymentFormProps {
  params?: CreatePaymentCheckoutParams
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ params, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false)
  const [checkoutData, setCheckoutData] = useState<PaymentCheckoutData | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleInitCheckout = async () => {
    try {
      setLoading(true)
      const response = await paymentService.createCheckout(params)

      if (response.data) {
        setCheckoutData(response.data)
        message.success('Đã khởi tạo thanh toán thành công!')
      }
    } catch (error) {
      message.error('Không thể khởi tạo thanh toán. Vui lòng thử lại!')
      onError?.(error as Error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPayment = () => {
    if (formRef.current) {
      formRef.current.submit()
      onSuccess?.()
    }
  }

  useEffect(() => {
    // Tự động khởi tạo checkout khi component mount
    handleInitCheckout()
  }, [])

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Spin size="large" />
        <p className="mt-4">Đang khởi tạo thanh toán...</p>
      </Card>
    )
  }

  if (!checkoutData) {
    return (
      <Card className="p-8 text-center">
        <p>Không thể tải thông tin thanh toán</p>
        <Button type="primary" onClick={handleInitCheckout} className="mt-4">
          Thử lại
        </Button>
      </Card>
    )
  }

  return (
    <Card title="Thanh toán đơn hàng" className="mx-auto max-w-md">
      <div className="mb-4">
        <p className="text-gray-600">
          Mã đơn hàng: <strong>{checkoutData.fields.order_invoice_number}</strong>
        </p>
        <p className="text-gray-600">
          Số tiền: <strong>{checkoutData.fields.order_amount.toLocaleString('vi-VN')} VNĐ</strong>
        </p>
        <p className="text-gray-600">
          Phương thức: <strong>{checkoutData.fields.payment_method}</strong>
        </p>
      </div>

      <form
        ref={formRef}
        action={checkoutData.checkoutUrl}
        method="POST"
        style={{ display: 'none' }}
      >
        {Object.entries(checkoutData.fields).map(([fieldName, fieldValue]) => (
          <input key={fieldName} type="hidden" name={fieldName} value={String(fieldValue)} />
        ))}
      </form>

      <Button type="primary" size="large" block onClick={handleSubmitPayment}>
        Thanh toán ngay
      </Button>
    </Card>
  )
}
