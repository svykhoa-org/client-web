import type { PaymentStatusContract } from '@/models/PaymentDomain'
import { unwrapSuccess } from '@/utils/apiResponse'

import { httpClient } from '../apiClient'

export async function getOrderPaymentStatus(orderId: string): Promise<PaymentStatusContract> {
  const response = await httpClient.get<PaymentStatusContract>(`/orders/${orderId}/payment`)
  return unwrapSuccess(response)
}

export async function waitForOrderFulfillment(
  orderId: string,
  timeoutMs = 60_000,
): Promise<PaymentStatusContract> {
  const startedAt = Date.now()
  let latest = await getOrderPaymentStatus(orderId)

  while (latest.fulfillment.status !== 'FULFILLED') {
    if (latest.fulfillment.status === 'FAILED' || latest.fulfillment.status === 'REVOKED') {
      throw new Error('Không thể cấp quyền truy cập cho đơn hàng.')
    }
    if (Date.now() - startedAt >= timeoutMs) return latest

    const hidden = typeof document !== 'undefined' && document.hidden
    const offline = typeof navigator !== 'undefined' && !navigator.onLine
    const elapsed = Date.now() - startedAt
    const interval = hidden || offline ? 5_000 : elapsed < 30_000 ? 2_000 : 5_000
    await new Promise(resolve =>
      window.setTimeout(resolve, interval + Math.floor(Math.random() * 500)),
    )
    latest = await getOrderPaymentStatus(orderId)
  }

  return latest
}
