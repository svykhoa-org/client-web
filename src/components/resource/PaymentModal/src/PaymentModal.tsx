import { useState } from 'react';

import {
  BankOutlined,
  CheckCircleOutlined,
  CloudDownloadOutlined,
  CreditCardOutlined,
  LoadingOutlined,
  MobileOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Radio, Spin, message } from 'antd';

import type { Resource } from '@/models/Resource';
import { PaymentMethod, processPayment } from '@/services/resource';

interface PaymentModalProps {
  resource: Resource;
  visible: boolean;
  onClose: () => void;
  onSuccess: (downloadUrl: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ resource, visible, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [form] = Form.useForm();

  const formatPrice = (price: number, currency: string): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency || 'VND',
    }).format(price);
  };

  const handlePayment = async () => {
    try {
      // Validate form fields
      await form.validateFields();

      if (!resource._id) {
        message.error('Không tìm thấy thông tin tài liệu');
        return;
      }

      const values = form.getFieldsValue();

      // Set loading state
      setLoading(true);

      // Process payment
      const paymentData = {
        resourceId: resource._id,
        paymentMethod,
        cardInfo:
          paymentMethod === PaymentMethod.CREDIT_CARD
            ? {
                cardNumber: values.cardNumber,
                cardHolder: values.cardHolder,
                expiryDate: values.expiryDate,
                cvv: values.cvv,
              }
            : undefined,
      };

      const response = await processPayment(paymentData);

      if (response.data && typeof response.data === 'object' && 'downloadUrl' in response.data) {
        setDownloadUrl(response.data.downloadUrl || '');
        setPaymentSuccess(true);
        message.success('Thanh toán thành công!');
      } else {
        message.error('Thanh toán thất bại, vui lòng thử lại sau.');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại sau.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Gọi callback để thông báo thành công và chuyển downloadUrl
    if (downloadUrl) {
      // Đây là nơi onSuccess được gọi từ nút Tải xuống trong modal
      onSuccess(downloadUrl);
      // Không cần đóng modal, vì onSuccess sẽ đóng nó
    }
  };

  const paymentMethods = [
    {
      value: PaymentMethod.CREDIT_CARD,
      label: 'Thẻ tín dụng / Ghi nợ',
      icon: <CreditCardOutlined />,
    },
    {
      value: PaymentMethod.BANK_TRANSFER,
      label: 'Chuyển khoản ngân hàng',
      icon: <BankOutlined />,
    },
    {
      value: PaymentMethod.MOMO,
      label: 'Ví MoMo',
      icon: <MobileOutlined style={{ color: '#d82d8b' }} />,
    },
    {
      value: PaymentMethod.ZALOPAY,
      label: 'ZaloPay',
      icon: <MobileOutlined style={{ color: '#0068ff' }} />,
    },
    {
      value: PaymentMethod.VNPAY,
      label: 'VNPay',
      icon: <MobileOutlined style={{ color: '#0068ff' }} />,
    },
  ];

  return (
    <Modal
      title={paymentSuccess ? 'Tải xuống tài liệu' : 'Thanh toán tài liệu'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      maskClosable={!paymentSuccess}
      closable={!paymentSuccess}
    >
      {!paymentSuccess ? (
        <>
          <div className="mb-6 flex items-center justify-between rounded-md bg-neutral-100 p-4">
            <div>
              <h3 className="mb-1 text-lg font-medium">{resource.title}</h3>
              <p className="text-neutral-6 text-sm">{resource.category?.name || 'Tài liệu y khoa'}</p>
            </div>
            <div className="text-primary-6 text-lg font-bold">{formatPrice(resource.price, resource.currency)}</div>
          </div>

          <h4 className="mb-3 text-base font-medium">Chọn phương thức thanh toán</h4>
          <Radio.Group onChange={e => setPaymentMethod(e.target.value)} value={paymentMethod} className="mb-4 w-full">
            {paymentMethods.map(method => (
              <Radio
                key={method.value}
                value={method.value}
                className="mb-2 flex items-center border-b border-gray-100 pb-2"
              >
                <div className="flex items-center gap-2">
                  {method.icon} {method.label}
                </div>
              </Radio>
            ))}
          </Radio.Group>

          <Form form={form} layout="vertical">
            {paymentMethod === PaymentMethod.CREDIT_CARD && (
              <>
                <Form.Item
                  label="Số thẻ"
                  name="cardNumber"
                  rules={[{ required: true, message: 'Vui lòng nhập số thẻ' }]}
                >
                  <Input placeholder="1234 5678 9012 3456" maxLength={19} />
                </Form.Item>
                <Form.Item
                  label="Chủ thẻ"
                  name="cardHolder"
                  rules={[{ required: true, message: 'Vui lòng nhập tên chủ thẻ' }]}
                >
                  <Input placeholder="NGUYEN VAN A" />
                </Form.Item>
                <div className="flex gap-4">
                  <Form.Item
                    label="Ngày hết hạn"
                    name="expiryDate"
                    className="w-1/2"
                    rules={[{ required: true, message: 'Vui lòng nhập ngày hết hạn' }]}
                  >
                    <Input placeholder="MM/YY" maxLength={5} />
                  </Form.Item>
                  <Form.Item
                    label="CVV"
                    name="cvv"
                    className="w-1/2"
                    rules={[{ required: true, message: 'Vui lòng nhập mã CVV' }]}
                  >
                    <Input placeholder="123" maxLength={3} />
                  </Form.Item>
                </div>
              </>
            )}

            {paymentMethod === PaymentMethod.BANK_TRANSFER && (
              <div className="rounded-md bg-neutral-50 p-4">
                <h4 className="mb-2 font-medium">Chuyển khoản theo thông tin sau:</h4>
                <p>
                  Ngân hàng: <strong>VietcomBank</strong>
                </p>
                <p>
                  Số tài khoản: <strong>1234567890123</strong>
                </p>
                <p>
                  Chủ tài khoản: <strong>DIỄN ĐÀN Y DƯỢC VIỆT NAM</strong>
                </p>
                <p>
                  Nội dung: <strong>MUA-TL-{resource._id}</strong>
                </p>
                <p className="mt-3 text-sm italic">Sau khi chuyển khoản, nhấn nút xác nhận và chờ xác nhận từ admin.</p>
              </div>
            )}

            {(paymentMethod === PaymentMethod.MOMO ||
              paymentMethod === PaymentMethod.ZALOPAY ||
              paymentMethod === PaymentMethod.VNPAY) && (
              <div className="rounded-md bg-neutral-50 p-4 text-center">
                <p className="mb-4">Quét mã QR để thanh toán {formatPrice(resource.price, resource.currency)}</p>
                <div className="mx-auto mb-4 h-40 w-40 bg-gray-200">
                  {/* QR Code placeholder */}
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">Mã QR</p>
                  </div>
                </div>
                <p className="text-sm italic">
                  Sau khi thanh toán qua ứng dụng, hệ thống sẽ tự động xác nhận và cấp quyền tải.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="text-neutral-6 flex items-center text-sm">
                <SafetyOutlined className="mr-1" /> Thanh toán an toàn & bảo mật
              </div>
              <div>
                <Button className="mr-2" onClick={onClose} disabled={loading}>
                  Huỷ
                </Button>
                <Button type="primary" onClick={handlePayment} disabled={loading}>
                  {loading ? <Spin indicator={<LoadingOutlined />} /> : 'Xác nhận thanh toán'}
                </Button>
              </div>
            </div>
          </Form>
        </>
      ) : (
        <div className="py-8 text-center">
          <div className="text-success-6 mb-4 text-5xl">
            <CheckCircleOutlined />
          </div>
          <h2 className="mb-2 text-xl font-bold">Thanh toán thành công!</h2>
          <p className="text-neutral-7 mb-8">Cảm ơn bạn đã mua tài liệu. Bạn có thể tải xuống ngay bây giờ.</p>
          <div className="mb-6 flex items-center justify-between rounded-md bg-neutral-100 p-4">
            <div>
              <h3 className="mb-1 text-lg font-medium">{resource.title}</h3>
              <p className="text-neutral-6 text-sm">{resource.category?.name || 'Tài liệu y khoa'}</p>
            </div>
            <div className="text-primary-6 text-lg font-bold">{formatPrice(resource.price, resource.currency)}</div>
          </div>
          <Button type="primary" size="large" icon={<CloudDownloadOutlined />} onClick={handleDownload}>
            Tải xuống ngay
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default PaymentModal;
