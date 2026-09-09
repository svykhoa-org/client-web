// Force a file download (with its original name) from a public URL.
// Bulletin attachments live in the public MinIO bucket and are served without a
// `Content-Disposition: attachment` header, so a plain <a href target=_blank>
// opens PDFs/images inline instead of downloading. Fetching the object as a blob
// and clicking a synthetic <a download> forces the download; the public bucket
// sends permissive CORS, so the cross-origin fetch succeeds. Falls back to
// opening the URL if the fetch is blocked for any reason.
export async function downloadFile(url: string, filename?: string): Promise<void> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = filename || url.split('/').pop() || 'download'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
