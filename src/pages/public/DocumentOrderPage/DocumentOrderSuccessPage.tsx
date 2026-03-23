import { Button, Card, Result } from 'antd'
import { useNavigate } from 'react-router'

import { RoutePath } from '@/routes'

export const DocumentOrderSuccessPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen mt-20 items-start justify-center p-4">
      <Card className="w-full max-w-xl rounded-sm shadow-sm">
        <Result
          status="success"
          title="Thanh toán thành công"
          subTitle="Tài liệu đã được kích hoạt trong tài khoản của bạn. Bạn có thể quay lại trang chi tiết để tải xuống ngay."
          extra={[
            <Button
              type="primary"
              key="documents"
              onClick={() => navigate(RoutePath.DocumentListPage.path)}
              className="rounded-md!"
              size="large"
            >
              Xem danh sách tài liệu
            </Button>,
            <Button
              key="home"
              onClick={() => navigate('/')}
              className="rounded-md! min-w-40"
              size="large"
            >
              Về trang chủ
            </Button>,
          ]}
        />
      </Card>
    </div>
  )
}
