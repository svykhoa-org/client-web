import type { User } from '@/models/User'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

export interface AuthResponseData {
  isTwoFactorRequired?: boolean
  accessToken?: string
  refreshToken?: string
  tempToken?: string
  user: User
}
