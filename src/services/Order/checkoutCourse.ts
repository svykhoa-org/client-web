import type { SuccessResponse } from '@/common/interface/ServiceResponse';

import { httpClient } from '../apiClient';

export interface CheckoutFields {
  operation: string;
  payment_method: string;
  order_invoice_number: string;
  order_amount: number;
  currency: string;
  order_description: string;
  customer_id: string;
  success_url: string;
  error_url: string;
  cancel_url: string;
  merchant: string;
  signature: string;
}

export interface CheckoutResponseData {
  checkoutUrl: string;
  checkoutFields: CheckoutFields;
}

export type CheckoutResponse = SuccessResponse<CheckoutResponseData>;

export const checkoutCourse = async (courseId: string): Promise<CheckoutResponse> => {
  return httpClient.post<CheckoutResponseData>('/order/course/checkout', { courseId });
};

export const orderService = {
  checkoutCourse,
};
