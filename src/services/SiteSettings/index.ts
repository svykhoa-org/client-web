import axiosInstance from '@/lib/axios'

export interface SiteSettings {
  siteName: string | null
  tagline: string | null
  logoId: string | null
  logoUrl: string | null
  faviconId: string | null
  faviconUrl: string | null
  contactEmail: string | null
  contactPhone: string | null
  contactAddress: string | null
  zaloUrl: string | null
  facebookUrl: string | null
  youtubeUrl: string | null
  tiktokUrl: string | null
  instagramUrl: string | null
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const response = await axiosInstance.get<{
    statusCode: number
    message: string
    data: SiteSettings
  }>('/site-settings')

  return response.data.data
}
