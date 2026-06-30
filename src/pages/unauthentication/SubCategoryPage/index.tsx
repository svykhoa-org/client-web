import { AsyncLoading } from '@/components/ui/AsyncLoading'
import { useAsyncState } from '@/hooks/useAsyncState'
import { useLayout } from '@/hooks/useLayout'
import type { ForumThread } from '@/models/Forum'
import { ThreadSortOption } from '@/models/Forum'
import type { ListResponseDataV2 } from '@/common/interface/ServiceResponse'
import { getThreadsBySubCategory } from '@/services/forum/forumService'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import { ThreadListItem } from './components/ThreadListItem'

const SORT_OPTIONS = [
  { label: 'Mới nhất', value: ThreadSortOption.LastReply },
  { label: 'Ngày tạo', value: ThreadSortOption.CreatedAt },
]

const PAGE_SIZE = 20

export const SubCategoryPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setLeftSidebar, setRightSidebar, setBanner } = useLayout()

  const [sort, setSort] = useState<ThreadSortOption>(ThreadSortOption.LastReply)
  const [page, setPage] = useState(1)
  const threadsState = useAsyncState<ListResponseDataV2<ForumThread>>()

  const load = useCallback(() => {
    if (!id) return
    void threadsState.execute(() => getThreadsBySubCategory(id, { page, limit: PAGE_SIZE, sort }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page, sort])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setLeftSidebar(null)
    setRightSidebar(null)
    setBanner(null)
    return () => {
      setBanner(null)
    }
  }, [setLeftSidebar, setRightSidebar, setBanner])

  const threads = threadsState.state.data?.items ?? []
  const totalPages = threadsState.state.data?.pagination.totalPages ?? 1

  return (
    <div className="bg-neutral-2 pb-8">
      <div className="container mx-auto px-4 pt-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate('/forum')}
            className="flex items-center gap-1 text-sm text-neutral-5 hover:text-neutral-7 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Diễn đàn
          </button>

          <select
            value={sort}
            onChange={e => {
              setSort(e.target.value as ThreadSortOption)
              setPage(1)
            }}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-neutral-7 focus:outline-none"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <AsyncLoading
          loading={threadsState.state.loading}
          type="skeleton"
          skeleton={{ rows: 8, title: true }}
        >
          {threadsState.state.error ? (
            <div className="rounded-lg border border-error-1 bg-error-1 px-6 py-8 text-center">
              <p className="text-sm text-error-3">{threadsState.state.error}</p>
              <button onClick={load} className="mt-3 text-sm text-primary-7 underline">
                Thử lại
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {threads.map(thread => (
                  <ThreadListItem key={thread.id} thread={thread} />
                ))}
                {threads.length === 0 && !threadsState.state.loading && (
                  <p className="py-12 text-center text-sm text-neutral-4">
                    Chưa có bài viết nào trong danh mục này.
                  </p>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    Trước
                  </button>
                  <span className="text-sm text-neutral-5">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </AsyncLoading>
      </div>
    </div>
  )
}
