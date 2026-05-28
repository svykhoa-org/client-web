import { RouterProvider } from 'react-router'
import { useEffect } from 'react'

import '@ant-design/v5-patch-for-react-19'

import { useSiteSettings } from '@/hooks/useSiteSettings'
import { LayoutProvider } from '@/contexts'
import { ThemeProvider } from '@/contexts/theme'
import { TanstackProvider } from '@/lib/tanstack-query'
import router from '@/routes'

function SiteSettingsEffect() {
  const { settings } = useSiteSettings()

  useEffect(() => {
    if (settings.siteName) {
      document.title = settings.siteName
    }

    if (settings.faviconUrl) {
      const existing = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null
      if (existing) {
        existing.href = settings.faviconUrl
      } else {
        const link = document.createElement('link')
        link.rel = 'icon'
        link.href = settings.faviconUrl
        document.head.appendChild(link)
      }
    }
  }, [settings.siteName, settings.faviconUrl])

  return null
}

function App() {
  return (
    <TanstackProvider>
      <SiteSettingsEffect />
      <ThemeProvider>
        <LayoutProvider>
          <RouterProvider router={router} />
        </LayoutProvider>
      </ThemeProvider>
    </TanstackProvider>
  )
}

export default App
