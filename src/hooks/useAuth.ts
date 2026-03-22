import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const store = useAuthStore();

  return {
    isAuthenticated: store.state.isAuthenticated,
    user: store.state.user,
    login: store.login,
    logout: store.logout,
    register: store.register,
    // loading: store.state.isLoggingIn, // Map isLoggingIn to loading if needed, or false if not used heavily
    loading: false, // Legacy loading state, authStore handles isLoggingIn separately
  };
};
