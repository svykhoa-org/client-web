import { AppConfig } from '@/constants/AppConfig'
import { type FileResource } from '@/models/FileResource'

// The server now returns a ready-to-use access URL in `file.url` (absolute for
// PUBLIC via public bucket, presigned for PRIVATE) — pass it through directly.
// Only fall back to prefixing for a legacy relative key. This fixes the double
// -prefix bug on /profile thumbnails where url was already absolute.
export const getPublicUrl = (file?: FileResource | null) => {
  if (!file?.url) return undefined
  if (file.url.startsWith('http')) return file.url
  return `${AppConfig.API_FILE_URL}${file.url}`
}
