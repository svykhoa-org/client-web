import type { CheckoutData } from '@/components/payment'
import { unwrapSuccess } from '@/utils/apiResponse'

import { httpClient } from '../apiClient'

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
  const response = await httpClient.post<CheckoutData>(DOCUMENT_ORDER_ENDPOINT, input)

  return unwrapSuccess(response)
}
