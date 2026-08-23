import DOMPurify from 'dompurify'

/**
 * Sanitize forum rich-text HTML before rendering with dangerouslySetInnerHTML.
 *
 * why: forum content is stored HTML authored via react-quill. The server
 * sanitizes on write (source of truth), but this is a defense-in-depth layer
 * that also protects against pre-existing content saved before server-side
 * sanitization was in place. DOMPurify's defaults strip <script>, on* handlers
 * and javascript: URLs.
 */
export const sanitizeHtml = (html: string | null | undefined): string =>
  DOMPurify.sanitize(html ?? '', { USE_PROFILES: { html: true } })
