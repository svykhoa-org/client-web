export enum CourseLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Canceled = 'canceled',
}

export enum PaymentMethod {
  // E-Wallets
  Momo = 'momo',
  VNPay = 'vnpay',

  // Others
  Free = 'free',
}

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';
