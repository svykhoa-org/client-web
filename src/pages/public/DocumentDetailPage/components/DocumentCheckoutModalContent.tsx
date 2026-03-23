import { SafetyCertificateOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Card, Descriptions, Typography } from 'antd'
import { useMemo } from 'react'

import paymentIllustration from '@/assets/payment-illustration.svg'
import type { DocumentCheckoutOutput } from '@/services/Document'

const { Text, Title } = Typography

interface DocumentCheckoutModalContentProps {
  checkoutData: DocumentCheckoutOutput
  title: string
}

const toInputValue = (value: string | number | boolean | null | undefined): string => {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return String(value)
}

const formatCurrency = (amount: number, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(amount)
}

export const DocumentCheckoutModalContent = ({
  checkoutData,
  title,
}: DocumentCheckoutModalContentProps) => {
  const { checkoutUrl, checkoutFields } = checkoutData

  const description = useMemo(
    () =>
      typeof checkoutFields.order_description === 'string'
        ? checkoutFields.order_description
        : `Thanh toán tài liệu ${title}`,
    [checkoutFields.order_description, title],
  )

  const invoice = useMemo(
    () =>
      typeof checkoutFields.order_invoice_number === 'string'
        ? checkoutFields.order_invoice_number
        : 'Đang cập nhật',
    [checkoutFields.order_invoice_number],
  )

  const amount = useMemo(
    () => (typeof checkoutFields.order_amount === 'number' ? checkoutFields.order_amount : 0),
    [checkoutFields.order_amount],
  )

  const currency = useMemo(
    () => (typeof checkoutFields.currency === 'string' ? checkoutFields.currency : 'VND'),
    [checkoutFields.currency],
  )

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="rounded-sm! border-slate-200 shadow-sm!">
        <div className="mb-4 flex items-center gap-2 text-slate-700">
          <SafetyCertificateOutlined className="text-lg text-blue-600" />
          <Title level={4} className="mb-0!">
            Xác nhận thanh toán an toàn
          </Title>
        </div>

        <Text className="mb-4 block text-slate-500">
          Bạn sắp được chuyển hướng đến cổng thanh toán SePay. Kiểm tra thông tin bên dưới trước khi
          tiếp tục.
        </Text>

        <Descriptions bordered column={1} size="small" className="mb-5">
          <Descriptions.Item label="Đơn hàng">{invoice}</Descriptions.Item>
          <Descriptions.Item label="Nội dung">{description}</Descriptions.Item>
          <Descriptions.Item
            label="Tổng tiền"
            contentStyle={{ fontWeight: 700, color: '#cf1322', fontSize: 16 }}
          >
            {formatCurrency(amount, currency)}
          </Descriptions.Item>
        </Descriptions>

        <form action={checkoutUrl} method="POST" className="space-y-3">
          {Object.entries(checkoutFields).map(([field, rawValue]) => (
            <input key={field} type="hidden" name={field} value={toInputValue(rawValue)} />
          ))}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<ShoppingCartOutlined />}
            block
            className="mt-4"
          >
            Thanh toán ngay
          </Button>
        </form>

        <Text className="mt-3 block text-center text-xs text-slate-400">
          Giao dịch được mã hóa và xử lý bởi SePay.
        </Text>
      </Card>

      <div className="relative overflow-hidden rounded-sm border border-slate-200 shadow-sm">
        <img
          src={paymentIllustration}
          alt="Minh họa thanh toán"
          className="h-full min-h-80 w-full object-cover"
        />
      </div>
    </div>
  )
}
