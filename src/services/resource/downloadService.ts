import type { SuccessResponse } from '@/common/interface/ServiceResponse';

import { httpClient } from '../apiClient';

// Interfaces for payment processing
export interface PaymentRequest {
  resourceId: string;
  paymentMethod: PaymentMethod;
  cardInfo?: CardInfo;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  downloadUrl?: string;
  message: string;
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  MOMO = 'momo',
  ZALOPAY = 'zalopay',
  VNPAY = 'vnpay',
}

export interface CardInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

// Function to process payment for a resource
export const processPayment = async (paymentData: PaymentRequest): Promise<SuccessResponse<PaymentResponse>> => {
  // In development environment, simulate payment process
  if (import.meta.env.DEV) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate successful payment
    return {
      statusCode: 200,
      message: 'Thanh toán thành công',
      data: {
        success: true,
        transactionId: `TX-${Math.random().toString(36).substring(2, 15)}`,
        downloadUrl: `/api/v1/resources/${paymentData.resourceId}/download`,
        message: 'Thanh toán thành công. Bạn có thể tải tài liệu ngay bây giờ.',
      },
      timestamp: new Date().toISOString(),
    };
  }

  // In production, call the actual payment API
  return await httpClient.post<PaymentResponse>('/resources/payment', paymentData);
};

// Function to download a resource
export const downloadResource = async (resourceId: string): Promise<SuccessResponse<{ downloadUrl: string }>> => {
  // In development environment, simulate download
  if (import.meta.env.DEV) {
    // Import mock data dynamically
    const { mockResources } = await import('@/mocks/resources');

    // Find the resource
    const resource = mockResources.find(r => r._id === resourceId);

    if (!resource) {
      throw new Error('Tài liệu không tồn tại');
    }

    // Increment download count (this wouldn't persist between page refreshes in DEV mode)
    resource.downloadCount++;

    // Return the direct file URL
    return {
      statusCode: 200,
      message: 'Download link generated successfully',
      data: {
        downloadUrl: resource.fileUrl,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // In production, call the actual API
  return await httpClient.get<{ downloadUrl: string }>(`/resources/${resourceId}/download`);
};

// Function to check if user has purchased a resource
export const checkPurchaseStatus = async (resourceId: string): Promise<SuccessResponse<{ purchased: boolean }>> => {
  if (import.meta.env.DEV) {
    return {
      statusCode: 200,
      message: 'Purchase status retrieved',
      data: {
        purchased: false,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // In production, call the actual API
  return await httpClient.get<{ purchased: boolean }>(`/resources/${resourceId}/purchase-status`);
};
