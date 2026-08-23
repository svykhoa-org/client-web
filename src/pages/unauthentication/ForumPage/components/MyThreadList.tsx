import { NewTopicButton } from '@/components/forum/NewTopicButton'
import { ThreadStatus, type ForumThread } from '@/models/Forum'
import { getMyForumThreads } from '@/services/forum/forumService'
import { FileText, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { ThreadListItem } from '../../SubCategoryPage/components/ThreadListItem'

const PAGE_SIZE = 20

export const MyThreadList = () => {
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(false)

  const loadFirst = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const response = await getMyForumThreads({ page: 1, limit: PAGE_SIZE })
      setThreads(response.items)
      setPage(1)
      setHasNext(response.pagination.hasNext)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadFirst()
  }, [loadFirst])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const response = await getMyForumThreads({ page: nextPage, limit: PAGE_SIZE })
      setThreads(current => [...current, ...response.items])
      setPage(nextPage)
      setHasNext(response.pagination.hasNext)
    } catch {
      // Keep the loaded pages visible; the user can retry with the same button.
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3" aria-label="Đang tải bài viết của tôi">
        {[0, 1, 2, 3].map(item => (
          <div key={item} className="h-20 animate-pulse rounded-lg bg-neutral-2" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-error-1 bg-white px-5 py-10 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-error-1 text-error-3">
          <RefreshCw className="h-5 w-5" />
        </span>
        <h2 className="mt-3 text-base font-semibold text-neutral-9">Chưa thể tải bài viết</h2>
        <p className="mt-1 text-sm text-neutral-5">Vui lòng thử lại sau ít phút.</p>
        <button
          type="button"
          onClick={() => void loadFirst()}
          className="mt-4 h-8 rounded-lg bg-primary-7 px-3 text-sm font-medium text-white transition-colors hover:bg-primary-8"
        >
          Thử lại
        </button>
      </div>
    )
  }

  if (threads.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-3 bg-white px-5 py-10 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-primary-1 text-primary-7">
          <FileText className="h-5 w-5" />
        </span>
        <h2 className="mt-3 text-base font-semibold text-neutral-9">Bạn chưa có bài viết nào</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-neutral-5">
          Đặt câu hỏi hoặc chia sẻ kinh nghiệm chuyên môn với cộng đồng.
        </p>
        <div className="mt-4">
          <NewTopicButton />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {threads.map(thread => (
        <ThreadListItem
          key={thread.id}
          thread={thread}
          showStatus
          canOpen={thread.status === ThreadStatus.Published}
        />
      ))}
      {hasNext && (
        <button
          type="button"
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
