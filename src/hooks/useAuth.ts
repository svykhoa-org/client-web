import { useAuthStore } from '@/stores/authStore'

export const useAuth = () => {
  const store = useAuthStore()

  return {
    isAuthenticated: store.state.isAuthenticated,
    user: store.state.user,
    login: store.login,
    logout: store.logout,
    register: store.register,
    loading: store.state.isLoggingIn,
  }
}
