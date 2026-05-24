import { OrderResultPage } from '@/components/payment'
import { RoutePath } from '@/routes'

export const DocumentOrderSuccessPage = () => (
  <OrderResultPage
    status="success"
    title="Thanh toán thành công"
    subTitle="Tài liệu đã được kích hoạt trong tài khoản của bạn. Bạn có thể quay lại trang chi tiết để tải xuống ngay."
    primaryLabel="Xem danh sách tài liệu"
    primaryPath={RoutePath.DocumentListPage.path}
  />
)
