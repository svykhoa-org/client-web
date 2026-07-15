import type { CheckoutData } from '@/components/payment'

import { httpClient } from '../apiClient'

export interface CheckoutResponse {
  statusCode: number
  message: string
  data: CheckoutData
}

export const checkoutCourse = async (courseId: string): Promise<CheckoutResponse> => {
  const response = await httpClient.post<CheckoutData>('/orders/checkout/course', {
    courseId,
    successUrl: `${window.location.origin}/order/success`,
    cancelUrl: `${window.location.origin}/order/cancel`,
    errorUrl: `${window.location.origin}/order/error`,
  })
  // Callers read the full envelope (statusCode/message/data), so re-shape SuccessResponse into
  // the CheckoutResponse contract with a strict `data: CheckoutData`.
  return {
    statusCode: response.statusCode,
    message: response.message,
    data: response.data as CheckoutData,
  }
}

export const orderService = {
  checkoutCourse,
}
