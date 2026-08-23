import Editor from '@/components/ui/Editor'
import type { ForumCategoryGroup, ForumPrefixTag } from '@/models/Forum'
import {
  createThread,
  getForumHomepage,
  getPrefixTags,
  uploadForumImage,
} from '@/services/forum/forumService'
import { useForumComposerStore } from '@/stores/forumComposerStore'
import { Select } from 'antd'
import { Maximize2, Minus, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import './forumComposer.css'

// Discourse-style docked composer. Content autosaves to the draft store
// (localStorage) so navigating away never loses work; a draft is resumed via
// the New Topic dropdown or the resume banner.
export const ForumComposer = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isOpen = useForumComposerStore(s => s.isOpen)
  const collapsed = useForumComposerStore(s => s.collapsed)
  const activeDraftId = useForumComposerStore(s => s.activeDraftId)
  const drafts = useForumComposerStore(s => s.drafts)
  const saveActive = useForumComposerStore(s => s.saveActive)
  const removeDraft = useForumComposerStore(s => s.removeDraft)
  const close = useForumComposerStore(s => s.close)
  const toggleCollapse = useForumComposerStore(s => s.toggleCollapse)

  const active = useMemo(
    () => drafts.find(d => d.id === activeDraftId) ?? null,
    [drafts, activeDraftId],
  )

  const [groups, setGroups] = useState<ForumCategoryGroup[]>([])
  const [tags, setTags] = useState<ForumPrefixTag[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedPath = useRef(location.pathname)

  useEffect(() => {
    if (mountedPath.current !== location.pathname) {
      close()
      mountedPath.current = location.pathname
    }
  }, [close, location.pathname])

  useEffect(() => () => close(), [close])

  useEffect(() => {
    if (!isOpen) return
    void getForumHomepage()
      .then(setGroups)
      .catch(() => {})
    void getPrefixTags()
      .then(setTags)
      .catch(() => {})
  }, [isOpen])

  if (!isOpen || !active) return null

  const plainLen = active.contentHtml.replace(/<[^>]*>/g, '').trim().length

  const handleSubmit = async () => {
    setError(null)
    if (!active.title.trim()) return setError('Vui lòng nhập tiêu đề')
    if (!active.subCategoryId) return setError('Vui lòng chọn danh mục')
    if (plainLen === 0) return setError('Vui lòng nhập nội dung')
    setSubmitting(true)
    try {
      const thread = await createThread({
        subCategoryId: active.subCategoryId,
        title: active.title.trim(),
        content: active.contentHtml,
        prefixTagId: active.prefixTagId ?? undefined,
      })
      removeDraft(active.id)
      navigate(`/forum/threads/${thread.id}`)
    } catch {
      setError('Không thể đăng bài. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const categoryOptions = groups.map(group => ({
    label: group.name,
    options: group.subCategories.map(subCategory => ({
      label: subCategory.name,
      value: subCategory.id,
    })),
  }))

  const tagOptions = tags.map(tag => ({ label: tag.name, value: tag.id }))

  return (
    <div
      className={`fixed bottom-0 left-2 right-2 z-50 w-auto overflow-hidden rounded-t-lg border border-neutral-3 bg-white shadow-sm transition-[max-width] duration-200 sm:left-4 sm:right-auto sm:w-[calc(100%_-_2rem)] ${
        collapsed ? 'sm:max-w-lg' : 'sm:max-w-3xl'
      }`}
    >
      {/* header */}
      <div
        className={`flex min-h-12 items-center justify-between bg-neutral-1 px-4 ${
          collapsed ? '' : 'border-b border-neutral-2'
        }`}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={toggleCollapse}
            className="min-w-0 flex-1 truncate py-3 text-left text-sm font-semibold text-neutral-8 transition-colors hover:text-primary-7"
          >
            Bản nháp đang viết, bấm để tiếp tục
          </button>
        ) : (
          <span className="text-sm font-semibold text-neutral-8">Tạo bài viết</span>
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={collapsed ? 'Mở rộng' : 'Thu gọn'}
            className="rounded-lg p-2 text-neutral-5 transition-colors hover:bg-neutral-2 hover:text-neutral-8 active:translate-y-px"
          >
            {collapsed ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Đóng"
            className="rounded-lg p-2 text-neutral-5 transition-colors hover:bg-neutral-2 hover:text-neutral-8 active:translate-y-px"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="flex max-h-[72dvh] flex-col gap-3 overflow-y-auto p-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-6">Tiêu đề</span>
            <input
              value={active.title}
              onChange={e => saveActive({ title: e.target.value })}
              maxLength={500}
              placeholder="Tiêu đề bài viết…"
              className="h-9 w-full rounded-lg border border-neutral-3 bg-white px-3 text-sm text-neutral-9 outline-none transition-colors placeholder:text-neutral-5 focus:border-primary-6 focus:ring-1 focus:ring-primary-3"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-xs font-semibold text-neutral-6">Danh mục</span>
              <Select
                value={active.subCategoryId || undefined}
                onChange={value => saveActive({ subCategoryId: value })}
                options={categoryOptions}
                placeholder="Chọn danh mục"
                showSearch
                optionFilterProp="label"
                size="middle"
                className="w-full [&_.ant-select-selector]:!rounded-lg"
              />
            </label>

            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-xs font-semibold text-neutral-6">Nhãn</span>
              <Select
                value={active.prefixTagId ?? undefined}
                onChange={value => saveActive({ prefixTagId: value ?? null })}
                options={tagOptions}
                placeholder="Không nhãn"
                allowClear
                showSearch
                optionFilterProp="label"
                size="middle"
                className="w-full [&_.ant-select-selector]:!rounded-lg"
              />
            </label>
          </div>

          <div className="forum-composer-editor w-full min-w-0">
            <Editor
              value={active.contentHtml}
              onChange={html => saveActive({ contentHtml: html })}
              placeholder="Viết nội dung bài viết…"
              onImageUpload={async file => (await uploadForumImage(file)).url}
            />
          </div>

          {error && <p className="text-sm text-error-5">{error}</p>}

          <div className="flex items-center justify-end gap-2 border-t border-neutral-2 pt-3">
            <button
              type="button"
              onClick={() => removeDraft(active.id)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-error-3 transition-colors hover:bg-error-1 active:translate-y-px"
            >
              <Trash2 className="h-4 w-4" />
              Xoá
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={submitting}
              className="h-10 rounded-lg bg-primary-7 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-8 active:translate-y-px disabled:opacity-60"
            >
              {submitting ? 'Đang đăng…' : 'Đăng bài'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
