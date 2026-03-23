/**
 * Authentication Store
 *
 * Quản lý trạng thái xác thực người dùng trong ứng dụng sử dụng Zustand
 * Bao gồm các chức năng: đăng nhập, đăng xuất, quản lý token và thông tin người dùng
 */
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { User } from '@/models/User'
import type { AuthResponseData, LoginRequest } from '@/services/auth'
import { login as authLogin, register as authRegister } from '@/services/auth'

/**
 * Định nghĩa trạng thái xác thực
 */
interface AuthState {
  // Trạng thái đang đăng nhập
  isLoggingIn: boolean
  // Token xác thực
  token: string | null
  // Thông tin người dùng đã đăng nhập
  user: User | null
  // Thông tin lỗi
  error: string | null
  // Trạng thái đã xác thực
  isAuthenticated: boolean
  // 2FA state
  isTwoFactorRequired: boolean
  tempToken: string | null
}

/**
 * Định nghĩa các actions của Auth Store
 */
interface AuthActions {
  // Đăng nhập với email và mật khẩu
  login: (email: string, password: string) => Promise<void>
  // Đăng ký người dùng mới
  register: (data: { email: string; password: string; fullName: string }) => Promise<void>
  // Đăng xuất khỏi hệ thống
  logout: () => void
  // Cập nhật token xác thực
  setToken: (token: string) => void
  // Cập nhật thông tin người dùng
  setUser: (user: User) => void
  // Xóa thông tin lỗi
  clearError: () => void
  // Cập nhật trạng thái xác thực
  setAuthenticated: (isAuthenticated: boolean) => void
  // Khởi tạo lại trạng thái
  resetState: () => void
}

/**
 * Định nghĩa Auth Store bao gồm state và actions
 */
interface AuthStore extends AuthActions {
  state: AuthState
}

type PersistedAuthState = Pick<AuthState, 'token' | 'user' | 'isAuthenticated'>

/**
 * Trạng thái mặc định của Auth Store
 */
const defaultAuthState: AuthState = {
  isLoggingIn: false,
  token: null,
  user: null,
  error: null,
  isAuthenticated: false,
  isTwoFactorRequired: false,
  tempToken: null,
}

/**
 * Tạo và export Auth Store sử dụng Zustand
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    set => {
      return {
        // Trạng thái ban đầu
        state: defaultAuthState,

        /**
         * Đăng nhập với email và mật khẩu
         * @param email Email người dùng
         * @param password Mật khẩu người dùng
         */
        login: async (email: string, password: string) => {
          // Cập nhật trạng thái đang đăng nhập
          set(state => ({
            state: {
              ...state.state,
              isLoggingIn: true,
              error: null,
            },
          }))

          try {
            // Chuẩn bị thông tin đăng nhập
            const credentials: LoginRequest = { email, password }
            // Gọi API đăng nhập
            const response = await authLogin(credentials)

            // Kiểm tra và xử lý kết quả đăng nhập
            if (response.data && typeof response.data === 'object') {
              const data = response.data as AuthResponseData

              if (data.isTwoFactorRequired && data.tempToken) {
                // Case 2FA required
                set(state => ({
                  state: {
                    ...state.state,
                    isLoggingIn: false,
                    isTwoFactorRequired: true,
                    tempToken: data.tempToken || null,
                    user: data.user,
                    error: null,
                  },
                }))
              } else if (data.accessToken) {
                // Case normal login
                set(state => ({
                  state: {
                    ...state.state,
                    isLoggingIn: false,
                    token: data.accessToken || null,
                    user: data.user,
                    isAuthenticated: true,
                    isTwoFactorRequired: false,
                    tempToken: null,
                    error: null,
                  },
                }))
              } else {
                throw new Error('Phản hồi không hợp lệ từ máy chủ: Thiếu token')
              }
            } else {
              // Xử lý trường hợp response không đúng định dạng
              throw new Error('Phản hồi không hợp lệ từ máy chủ')
            }
          } catch (error) {
            // Xử lý lỗi đăng nhập
            const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại'

            set(state => ({
              state: {
                ...state.state,
                isLoggingIn: false,
                error: errorMessage,
                token: null,
                user: null,
                isAuthenticated: false,
                isTwoFactorRequired: false,
                tempToken: null,
              },
            }))

            throw error
          }
        },

        /**
         * Đăng ký người dùng mới
         * @param data Dữ liệu đăng ký
         */
        register: async (data: { email: string; password: string; fullName: string }) => {
          // Cập nhật trạng thái đang đăng nhập (hoặc thêm isRegistering nếu cần, nhưng dùng chung isLoggingIn cũng tạm ổn cho loading)
          set(state => ({
            state: {
              ...state.state,
              isLoggingIn: true,
              error: null,
            },
          }))

          try {
            // Gọi API đăng ký
            const response = await authRegister(data)

            // Kiểm tra và xử lý kết quả
            if (response.data && typeof response.data === 'object') {
              const resData = response.data as AuthResponseData

              // Tương tự login, cập nhật state nếu server trả về token/user
              if (resData.accessToken) {
                set(state => ({
                  state: {
                    ...state.state,
                    isLoggingIn: false,
                    token: resData.accessToken || null,
                    user: resData.user,
                    isAuthenticated: true,
                    isTwoFactorRequired: false,
                    tempToken: null,
                    error: null,
                  },
                }))
              } else {
                // Trường hợp register thành công nhưng không auto-login (tùy backend),
                // ở đây giả sử backend trả về data như login.
                // Nếu backend chỉ trả message success thì cần handle kiểu khác,
                // nhưng interface AuthResponseData cho thấy nó trả về giống login.
                if (resData.user && !resData.accessToken) {
                  // Có user nhưng không có token -> Có thể cần verify email?
                  set(state => ({
                    state: {
                      ...state.state,
                      isLoggingIn: false,
                      error: null,
                      // Không set authenticated
                    },
                  }))
                } else {
                  throw new Error('Phản hồi không hợp lệ từ máy chủ: Thiếu token')
                }
              }
            } else {
              throw new Error('Phản hồi không hợp lệ từ máy chủ')
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại'
            set(state => ({
              state: {
                ...state.state,
                isLoggingIn: false,
                error: errorMessage,
                token: null,
                user: null,
                isAuthenticated: false,
                isTwoFactorRequired: false,
                tempToken: null,
              },
            }))
            throw error
          }
        },

        /**
         * Đăng xuất khỏi hệ thống
         */
        logout: () => {
          // Đặt lại trạng thái về mặc định
          set({ state: { ...defaultAuthState } })
        },

        /**
         * Cập nhật token xác thực
         * @param token Token mới
         */
        setToken: (token: string) => {
          set(state => ({
            state: {
              ...state.state,
              token,
              isAuthenticated: !!token,
            },
          }))
        },

        /**
         * Cập nhật thông tin người dùng
         * @param user Thông tin người dùng mới
         */
        setUser: (user: User) => {
          set(state => ({
            state: {
              ...state.state,
              user,
              isAuthenticated: !!user,
            },
          }))
        },

        /**
         * Xóa thông tin lỗi
         */
        clearError: () => {
          set(state => ({
            state: {
              ...state.state,
              error: null,
            },
          }))
        },

        /**
         * Cập nhật trạng thái xác thực
         * @param isAuthenticated Trạng thái xác thực mới
         */
        setAuthenticated: (isAuthenticated: boolean) => {
          set(state => ({
            state: {
              ...state.state,
              isAuthenticated,
            },
          }))
        },

        /**
         * Khởi tạo lại trạng thái
         */
        resetState: () => {
          set({ state: { ...defaultAuthState } })
        },
      }
    },
    {
      // Cấu hình lưu trữ
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Chỉ lưu các giá trị cần thiết để duy trì phiên đăng nhập
      partialize: state => ({
        state: {
          token: state.state.token,
          user: state.state.user,
          isAuthenticated: state.state.isAuthenticated,
        } satisfies PersistedAuthState,
      }),
      merge: (persistedState, currentState) => {
        const typedPersisted = persistedState as { state?: PersistedAuthState }

        return {
          ...currentState,
          state: {
            ...currentState.state,
            ...(typedPersisted.state ?? {}),
          },
        }
      },
    },
  ),
)

/**
 * Các selectors để truy cập trạng thái
 */

/**
 * Lấy trạng thái hiện tại của store mà không cần hook
 */
export const getAuthState = () => useAuthStore.getState().state

/**
 * Kiểm tra người dùng đã đăng nhập hay chưa
 */
export const isAuthenticated = () => useAuthStore.getState().state.isAuthenticated

/**
 * Lấy thông tin người dùng hiện tại
 */
export const getCurrentUser = () => useAuthStore.getState().state.user

/**
 * Lấy token xác thực hiện tại
 */
export const getAuthToken = () => useAuthStore.getState().state.token

/**
 * Lấy thông tin lỗi hiện tại
 */
export const getAuthError = () => useAuthStore.getState().state.error
