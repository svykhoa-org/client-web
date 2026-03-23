import axiosInstance from '@/lib/axios'
import type { ApiDetailResponse } from '@/shared/types/api'
import { unwrapDetail } from '@/utils/apiResponse'

const DOCUMENT_ORDER_ENDPOINT = '/document-orders/checkout'

export interface DocumentCheckoutInput {
  documentId: string
  successUrl: string
  cancelUrl: string
  errorUrl: string
}

export interface DocumentCheckoutFields extends Record<
  string,
  string | number | boolean | null | undefined
> {
  order_invoice_number?: string
  order_description?: string
  order_amount?: number
  currency?: string
}

export interface DocumentCheckoutOutput {
  checkoutUrl: string
  checkoutFields: DocumentCheckoutFields
}

export async function checkoutDocumentOrder(
  input: DocumentCheckoutInput,
): Promise<DocumentCheckoutOutput> {
  const response = await axiosInstance.post<ApiDetailResponse<DocumentCheckoutOutput>>(
    DOCUMENT_ORDER_ENDPOINT,
    input,
  )

  return unwrapDetail(response.data)
}
