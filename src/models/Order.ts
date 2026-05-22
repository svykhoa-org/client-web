import type { BaseModel } from './BaseModel'
import type { OrderStatus, PaymentMethod } from './enum'

export interface Order extends BaseModel {
  userId: string
  courseId: string
  amount: number // VND
  method: PaymentMethod // 'momo' | 'zalopay' | 'mompay' | 'free'
  status: OrderStatus // 'pending' | 'processing' | 'completed' | 'canceled'
  gatewayRef?: string // mã giao dịch từ cổng
  paidAt?: string
  canceledAt?: string
}
