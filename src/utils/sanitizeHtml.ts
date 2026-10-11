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
// why: Quill 2's getSemanticHTML() (react-quill-new's onChange value) writes
// every space as &nbsp;, leaving text with no line-break opportunities: it
// overflows its column and list items drop their text below the bullet. The
// server now normalizes on write; this covers content saved before that and
// unsaved editor previews. DOMPurify serializes U+00A0 back as "&nbsp;".
const NBSP = /&nbsp;|\u00a0/g

export const sanitizeHtml = (html: string | null | undefined): string =>
  DOMPurify.sanitize(html ?? '', { USE_PROFILES: { html: true } }).replace(NBSP, ' ')
