import axiosInstance from '@/lib/axios'
import type { CheckoutData } from '@/components/payment'

export interface CheckoutResponse {
  statusCode: number
  message: string
  data: CheckoutData
}

export const checkoutCourse = async (courseId: string): Promise<CheckoutResponse> => {
  const response = await axiosInstance.post<CheckoutResponse>('/orders/checkout/course', {
    courseId,
    successUrl: `${window.location.origin}/order/success`,
    cancelUrl: `${window.location.origin}/order/cancel`,
    errorUrl: `${window.location.origin}/order/error`,
  })
  return response.data
}

export const orderService = {
  checkoutCourse,
}
