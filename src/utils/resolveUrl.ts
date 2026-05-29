import { AppConfig } from '@/constants/AppConfig'

export function resolveUrl(url: string | null): string {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `${AppConfig.API_FILE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}
