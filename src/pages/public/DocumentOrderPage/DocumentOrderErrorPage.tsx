import { OrderResultPage } from '@/components/payment'
import { RoutePath } from '@/routes'

export const DocumentOrderErrorPage = () => (
  <OrderResultPage
    status="error"
    title="Thanh toán thất bại"
    subTitle="Hệ thống không thể xác nhận giao dịch. Vui lòng thử lại sau ít phút hoặc liên hệ hỗ trợ nếu lỗi lặp lại."
    primaryLabel="Thử lại"
    primaryPath={RoutePath.DocumentListPage.path}
  />
)
