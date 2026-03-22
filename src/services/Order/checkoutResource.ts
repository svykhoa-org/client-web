import type { SuccessResponse } from '@/common/interface/ServiceResponse';

import { httpClient } from '../apiClient';
import type { CheckoutResponseData } from './checkoutCourse';

export type { CheckoutResponseData };
export type CheckoutResponse = SuccessResponse<CheckoutResponseData>;

export const checkoutResource = async (resourceId: string): Promise<CheckoutResponse> => {
  // Assuming the backend has a similar endpoint for resources
  return httpClient.post<CheckoutResponseData>('/order/resource/checkout', { resourceId });
};

export const resourceOrderService = {
  checkoutResource,
};
