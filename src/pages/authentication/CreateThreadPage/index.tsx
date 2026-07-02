import { RequireAuth } from '@/components/auth'
import Editor from '@/components/ui/Editor'
import RouteConfig from '@/constants/RouteConfig'
import { useLayout } from '@/hooks/useLayout'
import { createThread } from '@/services/forum/forumService'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

const CreateThreadForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const subCategoryId = searchParams.get('subCategoryId') ?? ''
  const { setLeftSidebar, setRightSidebar, setBanner } = useLayout()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLeftSidebar(null)
    setRightSidebar(null)
    setBanner(null)
    return () => {
      setBanner(null)
    }
  }, [setLeftSidebar, setRightSidebar, setBanner])

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết')
      titleRef.current?.focus()
      return
    }
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    if (!plainText) {
      setError('Vui lòng nhập nội dung bài viết')
      return
    }
    if (!subCategoryId) {
      setError('Không tìm thấy danh mục. Vui lòng quay lại và thử lại.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await createThread({ subCategoryId, title: title.trim(), content })
      navigate(RouteConfig.ForumSubCategoryPage.path.replace(':id', subCategoryId))
    } catch {
      setError('Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-neutral-2 pb-10">
      <div className="container mx-auto px-4 pt-4">
        <button
          type="button"
          onClick={() =>
            subCategoryId
              ? navigate(RouteConfig.ForumSubCategoryPage.path.replace(':id', subCategoryId))
              : navigate(RouteConfig.ForumPage.path)
          }
          className="mb-5 flex items-center gap-1 text-sm text-neutral-5 transition-colors hover:text-neutral-7"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh mục
        </button>

        <div className="overflow-hidden rounded-lg border border-neutral-3 bg-white">
          <div className="border-b border-neutral-3 px-6 py-4">
            <h1 className="text-lg font-bold text-neutral-9">Tạo bài viết mới</h1>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-neutral-8" htmlFor="title">
                Tiêu đề <span className="text-error-5">*</span>
              </label>
              <input
                id="title"
                ref={titleRef}
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                maxLength={200}
                className="w-full rounded-lg border border-neutral-3 px-3 py-2.5 text-sm text-neutral-9 outline-none transition-colors focus:border-primary-6 focus:ring-1 focus:ring-primary-6"
              />
              <p className="mt-1 text-right text-xs text-neutral-4">{title.length}/200</p>
            </div>

            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-neutral-8">
                Nội dung <span className="text-error-5">*</span>
              </label>
              <div className="min-h-[300px]">
                <Editor
                  value={content}
                  onChange={setContent}
                  placeholder="Viết nội dung bài viết của bạn..."
                />
              </div>
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-error-1 px-4 py-2.5 text-sm text-error-5">{error}</p>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  subCategoryId
                    ? navigate(RouteConfig.ForumSubCategoryPage.path.replace(':id', subCategoryId))
                    : navigate(RouteConfig.ForumPage.path)
                }
                className="rounded-lg border border-neutral-3 px-4 py-2 text-sm text-neutral-7 transition-colors hover:bg-neutral-1"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-primary-6 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-7 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Đang đăng...' : 'Đăng bài'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const CreateThreadPage = () => (
  <RequireAuth>
    <CreateThreadForm />
  </RequireAuth>
)

export default CreateThreadPage
