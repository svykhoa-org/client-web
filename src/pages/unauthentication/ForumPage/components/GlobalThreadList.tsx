import type { ForumThread } from '@/models/Forum'
import { getGlobalThreads } from '@/services/forum/forumService'
import { useCallback, useEffect, useState } from 'react'
import { ThreadListItem } from '../../SubCategoryPage/components/ThreadListItem'

const PAGE_SIZE = 20

// Flat, cross-category thread list for the Hot / New tabs.
export const GlobalThreadList = ({ sort }: { sort: 'hot' | 'new' }) => {
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadFirst = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getGlobalThreads({ sort, page: 1, limit: PAGE_SIZE })
      setThreads(res.items)
      setPage(1)
      setHasNext(res.pagination.hasNext)
    } catch {
      // keep empty; empty state shows
    } finally {
      setLoading(false)
    }
  }, [sort])

  useEffect(() => {
    void loadFirst()
  }, [loadFirst])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const next = page + 1
      const res = await getGlobalThreads({ sort, page: next, limit: PAGE_SIZE })
      setThreads(prev => [...prev, ...res.items])
      setPage(next)
      setHasNext(res.pagination.hasNext)
    } catch {
      // ignore
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-neutral-2" />
        ))}
      </div>
    )
  }

  if (threads.length === 0) {
    return (
      <p className="rounded-lg border border-neutral-3 bg-white px-4 py-10 text-center text-sm text-neutral-4">
        Chưa có bài viết nào.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {threads.map(t => (
        <ThreadListItem key={t.id} thread={t} showPinned={false} />
      ))}
      {hasNext && (
        <button
          onClick={() => void loadMore()}
          disabled={loadingMore}
          className="w-full rounded-lg border border-neutral-3 py-2.5 text-sm font-medium text-neutral-6 transition-colors hover:bg-neutral-1 disabled:opacity-60"
        >
          {loadingMore ? 'Đang tải…' : 'Xem thêm'}
        </button>
      )}
    </div>
  )
}
