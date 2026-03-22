import type { PaymentCheckoutResponse } from '@/models/Payment';

import { httpClient } from '../apiClient';

export interface CreatePaymentCheckoutParams {
  //   courseId?: string;
  amount?: number;
  currency?: string;
  // Thêm các params khác nếu cần
}

export const paymentService = {
  /**
   * Tạo checkout URL để thanh toán
   */
  createCheckout: async (params?: CreatePaymentCheckoutParams): Promise<PaymentCheckoutResponse> => {
    const response = await httpClient.post<PaymentCheckoutResponse>('/payment', params || {});
    return response as any;
  },
};
