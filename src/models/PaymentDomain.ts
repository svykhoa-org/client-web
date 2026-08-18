export type CommercialOrderStatus = 'OPEN' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED'
export type PaymentIntentStatus = 'REQUIRES_PAYMENT' | 'PAID' | 'CANCELLED' | 'EXPIRED'
export type PaymentAttemptStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'EXPIRED'
export type FulfillmentStatus = 'NOT_STARTED' | 'PENDING' | 'FULFILLED' | 'FAILED' | 'REVOKED'

export interface PaymentCheckoutContract {
  contractVersion: 2
  checkoutUrl: string
  checkoutFields: Record<string, unknown>
  free: boolean
  order: {
    id: string
    orderCode: string
    commercialStatus: CommercialOrderStatus
    total: { amountMinor: string; currency: string }
  }
  payment: {
    required: boolean
    intentId: string | null
    status: PaymentIntentStatus | 'NOT_REQUIRED'
    attempt: {
      id: string
      status: PaymentAttemptStatus
      paymentCode: string
      customerExpiresAt: string
      qrPayload: string | null
    } | null
  }
  fulfillment: { status: FulfillmentStatus }
}

export interface PaymentStatusContract {
  contractVersion: 2
  etag: string
  order: {
    id: string
    orderCode: string
    commercialStatus: CommercialOrderStatus | null
    paymentStatus: string
    fulfillmentStatus: FulfillmentStatus | null
    total: { amountMinor: string; currency: string }
  }
  payment: {
    required: boolean
    intentId: string | null
    status: PaymentIntentStatus | 'LEGACY'
    attempt: {
      id: string
      status: PaymentAttemptStatus
      paymentCode: string
      customerExpiresAt: string
      settlementGraceUntil: string
      qrPayload: string | null
    } | null
    exception: { reason: string } | null
  }
  fulfillment: { status: FulfillmentStatus | null }
}
