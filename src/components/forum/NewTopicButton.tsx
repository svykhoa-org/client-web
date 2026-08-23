import RouteConfig from '@/constants/RouteConfig'
import { useAuth } from '@/hooks/useAuth'
import { useForumComposerStore } from '@/stores/forumComposerStore'
import { ChevronDown, PenSquare, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

// "Thêm bài viết" button with a draft dropdown (Discourse-style). If drafts
// exist, the caret opens a list to resume one; the main button always starts a
// new draft (prefilled with subCategoryId when opened from a category page).
export const NewTopicButton = ({ subCategoryId }: { subCategoryId?: string }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const drafts = useForumComposerStore(s => s.drafts)
  const openNew = useForumComposerStore(s => s.openNew)
  const openDraft = useForumComposerStore(s => s.openDraft)
  const removeDraft = useForumComposerStore(s => s.removeDraft)
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Posting requires auth (createThread would 401 otherwise) — gate at open time.
  const startNew = () => {
    if (!isAuthenticated) {
      navigate(
        `${RouteConfig.LoginPage.path}?redirect=${encodeURIComponent(window.location.pathname)}`,
      )
      return
    }
    openNew(subCategoryId)
  }

  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={startNew}
        className={`inline-flex h-8 items-center gap-1.5 whitespace-nowrap bg-primary-7 px-3 text-sm font-medium text-white transition-all hover:bg-primary-8 active:translate-y-px ${
          drafts.length > 0 ? 'rounded-l-lg' : 'rounded-lg'
        }`}
      >
        <PenSquare className="h-3.5 w-3.5" />
        Thêm bài viết
      </button>
      {drafts.length > 0 && (
        <button
          type="button"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Bản nháp"
          className="h-8 rounded-r-lg border-l border-primary-8 bg-primary-7 px-2 text-white transition-colors hover:bg-primary-8"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      )}

      {menuOpen && drafts.length > 0 && (
        <div className="absolute right-0 top-full z-40 mt-1 w-72 overflow-hidden rounded-lg border border-neutral-3 bg-white shadow-sm">
          <div className="border-b border-neutral-2 px-3 py-2 text-xs font-semibold uppercase text-neutral-4">
            Bản nháp ({drafts.length})
          </div>
          <ul className="max-h-72 overflow-y-auto">
            {drafts.map(d => (
              <li key={d.id} className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-1">
                <button
                  type="button"
                  onClick={() => {
                    openDraft(d.id)
                    setMenuOpen(false)
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm text-neutral-8">
                    {d.title.trim() || '(Chưa có tiêu đề)'}
                  </p>
                  <p className="text-xs text-neutral-4">
                    {new Date(d.updatedAt).toLocaleString('vi-VN')}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => removeDraft(d.id)}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs text-neutral-4 transition-colors hover:bg-error-1 hover:text-error-5"
                >
                  Xoá
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              startNew()
              setMenuOpen(false)
            }}
            className="flex w-full items-center gap-1.5 border-t border-neutral-2 px-3 py-2 text-sm font-medium text-primary-7 transition-colors hover:bg-primary-1"
          >
            <Plus className="h-4 w-4" />
            Bài mới
          </button>
        </div>
      )}
    </div>
  )
}
