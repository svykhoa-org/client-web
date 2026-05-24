import { OrderResultPage } from '@/components/payment'

import RouteConfig from '@/constants/RouteConfig'

export const OrderSuccessPage = () => (
  <OrderResultPage
    status="success"
    title="Thanh toán thành công!"
    subTitle="Cảm ơn bạn đã mua khoá học. Bạn có thể bắt đầu học ngay bây giờ."
    primaryLabel="Xem khoá học của tôi"
    primaryPath={RouteConfig.CoursePage.path}
  />
)
