import axiosInstance from '@/lib/axios'
import type { CheckoutData } from '@/components/payment'
import type { ApiDetailResponse } from '@/shared/types/api'
import { unwrapDetail } from '@/utils/apiResponse'

const DOCUMENT_ORDER_ENDPOINT = '/orders/checkout/document'

export interface DocumentCheckoutInput {
  documentId: string
  successUrl: string
  cancelUrl: string
  errorUrl: string
}

// Re-export CheckoutData as DocumentCheckoutOutput for backward compatibility
export type { CheckoutData as DocumentCheckoutOutput } from '@/components/payment'

export async function checkoutDocumentOrder(input: DocumentCheckoutInput): Promise<CheckoutData> {
  const response = await axiosInstance.post<ApiDetailResponse<CheckoutData>>(
    DOCUMENT_ORDER_ENDPOINT,
    input,
  )

  return unwrapDetail(response.data)
}
