import { Button, Card, Result } from 'antd'
import { useNavigate } from 'react-router'

import { RoutePath } from '@/routes'

export const DocumentOrderErrorPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen mt-20 items-start justify-center p-4">
      <Card className="w-full max-w-xl rounded-sm shadow-sm">
        <Result
          status="error"
          title="Thanh toán thất bại"
          subTitle="Hệ thống không thể xác nhận giao dịch. Vui lòng thử lại sau ít phút hoặc liên hệ hỗ trợ nếu lỗi lặp lại."
          extra={[
            <Button
              type="primary"
              key="retry"
              onClick={() => navigate(RoutePath.DocumentListPage.path)}
              size="large"
              className="min-w-40"
            >
              Thử lại
            </Button>,
            <Button key="home" onClick={() => navigate('/')} size="large" className="min-w-40">
              Về trang chủ
            </Button>,
          ]}
        />
      </Card>
    </div>
  )
}
