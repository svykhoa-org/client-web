import type { SuccessResponse } from '@/common/interface/ServiceResponse'
import type { User } from '@/models/User'

import { httpClient } from '../apiClient'

// --- Interfaces ---

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

// Response for Login/Register/Refresh
export interface AuthResponseData {
  isTwoFactorRequired?: boolean
  accessToken?: string
  refreshToken?: string
  tempToken?: string // For 2FA case
  user: User
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyEmailRequest {
  email: string
  code: string
}

export interface ResendVerifyEmailRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  code: string
  newPassword: string
}

export interface TwoFAEnableRequest {
  code: string
}

export interface TwoFAAuthenticateRequest {
  code: string
}

export interface TwoFAGenerateResponse {
  secret: string
  qrCode: string
}

// --- API Methods ---

// 1. Authentication (Core)

export const register = async (
  userData: RegisterRequest,
): Promise<SuccessResponse<AuthResponseData>> => {
  return await httpClient.post<AuthResponseData>('/auth/register', userData)
}

export const login = async (
  credentials: LoginRequest,
): Promise<SuccessResponse<AuthResponseData>> => {
  return await httpClient.post<AuthResponseData>('/auth/login', credentials)
}

export const logout = async (): Promise<SuccessResponse<null>> => {
  return await httpClient.post<null>('/auth/logout')
}

export const refreshToken = async (
  data: RefreshTokenRequest,
): Promise<SuccessResponse<AuthResponseData>> => {
  return await httpClient.post<AuthResponseData>('/auth/refresh', data)
}

// 2. User Management

export const getCurrentUser = async (): Promise<SuccessResponse<User>> => {
  return await httpClient.get<User>('/auth/profile')
}

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<SuccessResponse<{ message: string }>> => {
  return await httpClient.post<{ message: string }>('/auth/change-password', data)
}

// 3. Account Recovery

export const verifyEmail = async (
  data: VerifyEmailRequest,
): Promise<SuccessResponse<{ message: string }>> => {
  return await httpClient.post<{ message: string }>('/auth/verify-email', data)
}

export const resendVerifyEmail = async (
  data: ResendVerifyEmailRequest,
): Promise<SuccessResponse<{ message: string }>> => {
  return await httpClient.post<{ message: string }>('/auth/resend-verify-email', data)
}

export const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<SuccessResponse<{ message: string }>> => {
  return await httpClient.post<{ message: string }>('/auth/forgot-password', data)
}

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<SuccessResponse<{ message: string }>> => {
  return await httpClient.post<{ message: string }>('/auth/reset-password', data)
}

// 4. Two-Factor Authentication (2FA)

export const generate2FA = async (): Promise<SuccessResponse<TwoFAGenerateResponse>> => {
  return await httpClient.get<TwoFAGenerateResponse>('/auth/2fa/generate')
}

export const enable2FA = async (
  data: TwoFAEnableRequest,
): Promise<SuccessResponse<{ message: string }>> => {
  return await httpClient.post<{ message: string }>('/auth/2fa/enable', data)
}

export const authenticate2FA = async (
  data: TwoFAAuthenticateRequest,
): Promise<SuccessResponse<AuthResponseData>> => {
  return await httpClient.post<AuthResponseData>('/auth/2fa/authenticate', data)
}
