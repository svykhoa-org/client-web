export interface PaymentCheckoutFields {
  payment_method: string;
  order_invoice_number: string;
  order_amount: number;
  currency: string;
  order_description: string;
  success_url: string;
  error_url: string;
  cancel_url: string;
  merchant: string;
  operation: string;
  signature: string;
}

export interface PaymentCheckoutData {
  checkoutUrl: string;
  fields: PaymentCheckoutFields;
}

export interface PaymentCheckoutResponse {
  statusCode: number;
  message: string;
  data: PaymentCheckoutData;
  requestId: string;
  timestamp: string;
}
