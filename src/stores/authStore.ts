import { clearTokens, getRefreshToken, setAccessToken, setTokens } from '@/lib/axios'
import type { User } from '@/models/User'
import type { AuthResponseData, LoginRequest, RegisterRequest } from '@/services/auth'
import { login as authLogin, logout as authLogout, register as authRegister } from '@/services/auth'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  isLoggingIn: boolean
  token: string | null
  user: User | null
  error: string | null
  isAuthenticated: boolean
  isTwoFactorRequired: boolean
  tempToken: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  setToken: (token: string) => void
  setUser: (user: User) => void
  clearError: () => void
  setAuthenticated: (isAuthenticated: boolean) => void
  resetState: () => void
}

interface AuthStore extends AuthActions {
  state: AuthState
}

type PersistedAuthState = Pick<AuthState, 'token' | 'user' | 'isAuthenticated'>

const defaultAuthState: AuthState = {
  isLoggingIn: false,
  token: null,
  user: null,
  error: null,
  isAuthenticated: false,
  isTwoFactorRequired: false,
  tempToken: null,
}

const normalizeAuthError = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

const applyAuthenticatedSession = (data: AuthResponseData) => {
  const accessToken = data.accessToken ?? null
  const refreshToken = data.refreshToken ?? null

  if (!accessToken) {
    throw new Error('Phan hoi khong hop le tu may chu: Thieu accessToken')
  }

  if (refreshToken) {
    setTokens(accessToken, refreshToken)
  } else {
    setAccessToken(accessToken)
  }

  return {
    token: accessToken,
    user: data.user,
    isAuthenticated: true,
    isTwoFactorRequired: false,
    tempToken: null,
  } satisfies Pick<
    AuthState,
    'token' | 'user' | 'isAuthenticated' | 'isTwoFactorRequired' | 'tempToken'
  >
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      state: defaultAuthState,

      login: async (email: string, password: string) => {
        set(prev => ({
          state: {
            ...prev.state,
            isLoggingIn: true,
            error: null,
          },
        }))

        try {
          const credentials: LoginRequest = { email, password }
          const data = await authLogin(credentials)

          if (data.isTwoFactorRequired && data.tempToken) {
            clearTokens()
            set(prev => ({
              state: {
                ...prev.state,
                isLoggingIn: false,
                token: null,
                isAuthenticated: false,
                isTwoFactorRequired: true,
                tempToken: data.tempToken ?? null,
                user: data.user,
                error: null,
              },
            }))
            return
          }

          set(prev => ({
            state: {
              ...prev.state,
              isLoggingIn: false,
              ...applyAuthenticatedSession(data),
              error: null,
            },
          }))
        } catch (error) {
          clearTokens()
          set(prev => ({
            state: {
              ...prev.state,
              isLoggingIn: false,
              token: null,
              user: null,
              isAuthenticated: false,
              isTwoFactorRequired: false,
              tempToken: null,
              error: normalizeAuthError(error, 'Dang nhap that bai'),
            },
          }))

          throw error
        }
      },

      register: async (payload: RegisterRequest) => {
        set(prev => ({
          state: {
            ...prev.state,
            isLoggingIn: true,
            error: null,
          },
        }))

        try {
          const data = await authRegister(payload)

          if (data.accessToken) {
            set(prev => ({
              state: {
                ...prev.state,
                isLoggingIn: false,
                ...applyAuthenticatedSession(data),
                error: null,
              },
            }))
            return
          }

          set(prev => ({
            state: {
              ...prev.state,
              isLoggingIn: false,
              user: data.user ?? null,
              error: null,
            },
          }))
        } catch (error) {
          clearTokens()
          set(prev => ({
            state: {
              ...prev.state,
              isLoggingIn: false,
              token: null,
              user: null,
              isAuthenticated: false,
              isTwoFactorRequired: false,
              tempToken: null,
              error: normalizeAuthError(error, 'Dang ky that bai'),
            },
          }))
          throw error
        }
      },

      logout: () => {
        const refreshToken = getRefreshToken()

        set({ state: { ...defaultAuthState } })
        clearTokens()

        if (refreshToken) {
          void authLogout().catch(() => undefined)
        }
      },

      setToken: (token: string) => {
        setAccessToken(token)
        set(prev => ({
          state: {
            ...prev.state,
            token,
            isAuthenticated: !!token,
          },
        }))
      },

      setUser: (user: User) => {
        set(prev => ({
          state: {
            ...prev.state,
            user,
            isAuthenticated: !!(prev.state.token && user),
          },
        }))
      },

      clearError: () => {
        set(prev => ({
          state: {
            ...prev.state,
            error: null,
          },
        }))
      },

      setAuthenticated: (isAuthenticated: boolean) => {
        set(prev => ({
          state: {
            ...prev.state,
            isAuthenticated,
          },
        }))
      },

      resetState: () => {
        clearTokens()
        set({ state: { ...defaultAuthState } })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        state: {
          token: state.state.token,
          user: state.state.user,
          isAuthenticated: state.state.isAuthenticated,
        } satisfies PersistedAuthState,
      }),
      merge: (persistedState, currentState) => {
        const typedPersisted = persistedState as { state?: PersistedAuthState }
        const mergedState = {
          ...currentState.state,
          ...(typedPersisted.state ?? {}),
        }

        if (mergedState.token) {
          setAccessToken(mergedState.token)
        }

        return {
          ...currentState,
          state: mergedState,
        }
      },
    },
  ),
)

export const getAuthState = () => useAuthStore.getState().state
export const isAuthenticated = () => useAuthStore.getState().state.isAuthenticated
export const getCurrentUser = () => useAuthStore.getState().state.user
export const getAuthToken = () => useAuthStore.getState().state.token
export const getAuthError = () => useAuthStore.getState().state.error
