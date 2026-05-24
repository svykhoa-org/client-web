import { OrderResultPage } from '@/components/payment'
import { RoutePath } from '@/routes'

export const DocumentOrderCancelPage = () => (
  <OrderResultPage
    status="warning"
    title="Đã huỷ thanh toán"
    subTitle="Giao dịch chưa được hoàn tất. Bạn có thể quay lại trang tài liệu để thực hiện thanh toán lại bất kỳ lúc nào."
    primaryLabel="Thử lại"
    primaryPath={RoutePath.DocumentListPage.path}
  />
)
