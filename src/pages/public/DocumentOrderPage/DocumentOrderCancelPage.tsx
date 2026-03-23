import { Button, Card, Result } from 'antd'
import { useNavigate } from 'react-router'

import { RoutePath } from '@/routes'

export const DocumentOrderCancelPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen mt-20 items-start justify-center p-4">
      <Card className="w-full max-w-xl rounded-sm shadow-sm">
        <Result
          status="warning"
          title="Bạn đã hủy thanh toán"
          subTitle="Giao dịch chưa được hoàn tất. Bạn có thể quay lại trang tài liệu để thực hiện thanh toán lại bất kỳ lúc nào."
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
