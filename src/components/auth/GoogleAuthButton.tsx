import { GoogleLogin } from '@react-oauth/google'
import { message } from 'antd'

import { AppConfig } from '@/constants/AppConfig'
import { useAuthStore } from '@/stores/authStore'

interface Props {
  // Called after a successful Google sign-in so the page can navigate (login vs register
  // share the same button; the destination differs per page).
  onSuccess: () => void
}

/**
 * "Sign in with Google" button (Google Identity Services). Renders nothing when the Google
 * client id is not configured, so the feature stays disabled until VITE_GOOGLE_CLIENT_ID is set.
 * Both login and register use this — Google sign-in is find-or-create on the server.
 */
export const GoogleAuthButton = ({ onSuccess }: Props) => {
  const loginWithGoogle = useAuthStore(store => store.loginWithGoogle)

  if (!AppConfig.GOOGLE_CLIENT_ID) return null

  return (
    <div className="flex justify-center">
      <GoogleLogin
        text="continue_with"
        shape="rectangular"
        width="360"
        onSuccess={async credentialResponse => {
          const credential = credentialResponse.credential
          if (!credential) {
            void message.error('Không nhận được thông tin từ Google')
            return
          }
          try {
            await loginWithGoogle(credential)
            onSuccess()
          } catch (err) {
            void message.error(err instanceof Error ? err.message : 'Đăng nhập Google thất bại')
          }
        }}
        onError={() => {
          void message.error('Đăng nhập Google thất bại')
        }}
      />
    </div>
  )
}
