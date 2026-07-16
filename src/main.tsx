import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf'

import { GoogleOAuthProvider } from '@react-oauth/google'

import App from './App'
import { AppConfig } from './constants/AppConfig'
import './styles/globals.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={AppConfig.GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
