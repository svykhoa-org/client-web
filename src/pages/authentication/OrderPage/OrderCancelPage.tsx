import { OrderResultPage } from '@/components/payment'

import RouteConfig from '@/constants/RouteConfig'

export const OrderCancelPage = () => (
  <OrderResultPage
    status="warning"
    title="Đã huỷ thanh toán"
    subTitle="Giao dịch đã bị huỷ. Nếu bạn gặp vấn đề khi thanh toán, vui lòng thử lại."
    primaryLabel="Thử lại"
    primaryPath={RouteConfig.CoursePage.path}
  />
)
