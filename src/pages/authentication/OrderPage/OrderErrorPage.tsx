import { OrderResultPage } from '@/components/payment'

import RouteConfig from '@/constants/RouteConfig'

export const OrderErrorPage = () => (
  <OrderResultPage
    status="error"
    title="Thanh toán thất bại"
    subTitle="Có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng thử lại sau hoặc liên hệ hỗ trợ."
    primaryLabel="Thử lại"
    primaryPath={RouteConfig.CoursePage.path}
  />
)
