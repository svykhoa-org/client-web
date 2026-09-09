import { useQuery } from '@tanstack/react-query'

import { BRAND_NAME } from '@/constants/brand'
import { fetchSiteSettings, type SiteSettings } from '@/services/SiteSettings'

const FALLBACK: SiteSettings = {
  siteName: BRAND_NAME,
  tagline: null,
  logoId: null,
  logoUrl: null,
  faviconId: null,
  faviconUrl: null,
  contactEmail: null,
  contactPhone: null,
  contactAddress: null,
  zaloUrl: null,
  facebookUrl: null,
  youtubeUrl: null,
  tiktokUrl: null,
  instagramUrl: null,
}

export function useSiteSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  })

  return {
    settings: data ?? FALLBACK,
    isLoading,
  }
}
