import { FacebookFilled, LinkOutlined, TwitterOutlined } from '@ant-design/icons'
import { App } from 'antd'
import type { FC } from 'react'

// Subtle share row: Facebook + X/Twitter via share intents + copy link.
export const ShareRow: FC<{ title: string }> = ({ title }) => {
  const { message } = App.useApp()
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const openShare = (shareUrl: string) =>
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500')

  const shareFacebook = () =>
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)

  const shareX = () =>
    openShare(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    )

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      void message.success('Đã sao chép liên kết')
    } catch {
      void message.error('Không thể sao chép liên kết')
    }
  }

  const btnClass =
    'flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-3 text-neutral-7 transition-colors hover:bg-neutral-2 hover:text-primary-6'

  return (
    <div className="mt-12 flex items-center gap-3 border-t border-neutral-3 pt-6">
      <span className="text-sm text-neutral-6">Chia sẻ:</span>
      <button
        type="button"
        aria-label="Chia sẻ Facebook"
        className={btnClass}
        onClick={shareFacebook}
      >
        <FacebookFilled />
      </button>
      <button type="button" aria-label="Chia sẻ X" className={btnClass} onClick={shareX}>
        <TwitterOutlined />
      </button>
      <button
        type="button"
        aria-label="Sao chép liên kết"
        className={btnClass}
        onClick={() => void copyLink()}
      >
        <LinkOutlined />
      </button>
    </div>
  )
}
