import { AsyncLoading } from '@/components/ui/AsyncLoading'
import RouteConfig from '@/constants/RouteConfig'
import { useAsyncState } from '@/hooks/useAsyncState'
import { useAuth } from '@/hooks/useAuth'
import { useLayout } from '@/hooks/useLayout'
import type { ForumComment, ForumSubCategory, ForumThread } from '@/models/Forum'
import {
  createComment,
  getSubCategoryById,
  getThreadById,
  getThreadComments,
  toggleThreadReaction,
} from '@/services/forum/forumService'
import { ArrowLeft, CornerDownRight, Eye, Lock, MessageSquare, Send, ThumbsUp } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

// ─── helpers ──────────────────────────────────────────────────────────────────

// Backend timestamps come from `timestamp` columns (no zone) → parse as UTC.
const toDate = (dateStr: string) => {
  const hasTz = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(dateStr)
  return new Date(hasTz ? dateStr : `${dateStr.replace(' ', 'T')}Z`)
}

const formatDate = (dateStr: string) =>
  toDate(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const formatRelative = (dateStr: string) => {
  const diff = Date.now() - toDate(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Vừa xong'
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} ngày trước`
  return formatDate(dateStr)
}

const countComments = (nodes: ForumComment[]): number =>
  nodes.reduce((sum, n) => sum + 1 + countComments(n.replies ?? []), 0)

const loginRedirect = () =>
  `${RouteConfig.LoginPage.path}?redirect=${encodeURIComponent(window.location.pathname)}`

const SOFT_SHADOW = 'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_rgba(15,23,42,0.05)]'
const MAX_DEPTH = 2 // 0-indexed → tối đa 3 cấp comment
const ROOT_PAGE_SIZE = 10

const Avatar = ({
  name,
  src,
  size = 40,
}: {
  name?: string | null
  src?: string | null
  size?: number
}) => {
  const letter = name?.trim().charAt(0).toUpperCase() ?? 'U'
  if (src)
    return (
      <img
        src={src}
        alt={name ?? 'avatar'}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-primary-6 font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {letter}
    </div>
  )
}

// ─── breadcrumb ───────────────────────────────────────────────────────────────

const Breadcrumb = ({
  thread,
  subCategory,
}: {
  thread: ForumThread
  subCategory: ForumSubCategory | null
}) => {
  const navigate = useNavigate()

  if (!subCategory) {
    return (
      <button
        onClick={() =>
          navigate(RouteConfig.ForumSubCategoryPage.path.replace(':id', thread.subCategoryId))
        }
        className="mb-[18px] flex items-center gap-1 text-xs text-neutral-5 transition-colors hover:text-neutral-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Quay lại danh mục
      </button>
    )
  }

  return (
    <nav className="mb-[18px] flex flex-wrap items-center gap-1.5 text-xs text-neutral-5">
      <Link to={RouteConfig.ForumPage.path} className="transition-colors hover:text-neutral-8">
        Diễn đàn
      </Link>
      {subCategory.group && (
        <>
          <span className="text-neutral-4">›</span>
          <span className="max-w-[180px] truncate">{subCategory.group.name}</span>
        </>
      )}
      <span className="text-neutral-4">›</span>
      <Link
        to={RouteConfig.ForumSubCategoryPage.path.replace(':id', thread.subCategoryId)}
        className="max-w-[180px] truncate transition-colors hover:text-neutral-8"
      >
        {subCategory.name}
      </Link>
    </nav>
  )
}

// ─── article reaction (real, persisted) ─────────────────────────────────────────

const ReactionBar = ({ thread }: { thread: ForumThread }) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [reacted, setReacted] = useState(!!thread.hasReacted)
  const [count, setCount] = useState(thread.reactionCount ?? 0)
  const [busy, setBusy] = useState(false)

  const toggle = async () => {
    if (!isAuthenticated) {
      navigate(loginRedirect())
      return
    }
    if (busy) return
    setBusy(true)
    try {
      const res = await toggleThreadReaction(thread.id)
      setReacted(res.reacted)
      setCount(res.count)
    } catch {
      // ignore; keep previous state
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-7">
      <button
        onClick={() => void toggle()}
        disabled={busy}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
          reacted
            ? 'border-primary-6 bg-primary-1 text-primary-7'
            : 'border-neutral-3 text-neutral-6 hover:bg-neutral-1'
        }`}
      >
        <ThumbsUp className={`h-4 w-4 ${reacted ? 'fill-current' : ''}`} />
        Thích{count > 0 ? ` · ${count}` : ''}
      </button>
    </div>
  )
}

// ─── article (OP) ───────────────────────────────────────────────────────────────

const ThreadArticle = ({ thread }: { thread: ForumThread }) => (
  <article className={`rounded-[18px] bg-white p-8 ${SOFT_SHADOW}`}>
    {thread.prefixTag && (
      <span
        className="mb-3.5 inline-block rounded-md px-2 py-0.5 text-xs font-medium text-white"
        style={{ backgroundColor: thread.prefixTag.colorHex }}
      >
        {thread.prefixTag.name}
      </span>
    )}

    <h1 className="mb-5 text-[30px] font-bold leading-[1.25] tracking-tight text-neutral-9">
      {thread.title}
    </h1>

    <div className="flex items-center gap-3">
      <Avatar name={thread.author?.fullName} src={thread.author?.avatar} size={40} />
      <div>
        <p className="text-sm font-semibold text-neutral-8">
          {thread.author?.fullName ?? 'Ẩn danh'}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-4 tabular-nums">
          <span>{formatDate(thread.createdAt)}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {thread.viewCount.toLocaleString()} lượt xem
          </span>
        </div>
      </div>
    </div>

    <div className="my-6 h-px bg-neutral-2" />

    <div
      className="prose max-w-none"
      style={{ fontSize: 15, lineHeight: 1.8 }}
      dangerouslySetInnerHTML={{ __html: thread.content }}
    />

    <ReactionBar thread={thread} />
  </article>
)

// ─── reply box (inline) ─────────────────────────────────────────────────────────

const ReplyBox = ({
  threadId,
  parentId,
  initialValue,
  onDone,
  onCancel,
}: {
  threadId: string
  parentId: string
  initialValue?: string
  onDone: () => void
  onCancel: () => void
}) => {
  const [value, setValue] = useState(initialValue ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    const content = value.trim()
    if (!content || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await createComment(threadId, content, parentId)
      onDone()
    } catch {
      setError('Không thể gửi trả lời. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-2.5">
      <textarea
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            void submit()
          }
        }}
        rows={2}
        placeholder="Viết trả lời…"
        disabled={submitting}
        className="w-full resize-none rounded-lg border border-neutral-3 px-3 py-2 text-sm text-neutral-9 placeholder:text-neutral-4 focus:border-primary-5 focus:outline-none disabled:opacity-60"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => void submit()}
          disabled={!value.trim() || submitting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-6 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-7 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          Trả lời
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm text-neutral-5 transition-colors hover:text-neutral-8"
        >
          Hủy
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-error-5">{error}</p>}
    </div>
  )
}

// ─── comment node (nested) ──────────────────────────────────────────────────────

const CommentNode = ({
  comment,
  threadId,
  depth,
  expandedIds,
  onToggleExpand,
  onReplied,
}: {
  comment: ForumComment
  threadId: string
  depth: number
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onReplied: (parentId: string) => void
}) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [replying, setReplying] = useState(false)
  const replies = comment.replies ?? []
  const isExpanded = expandedIds.has(comment.id)

  // Cấp 3 (depth 2): reply flatten thành sibling — parent là ancestor cấp 2,
  // prefill @mention người được trả lời (kiểu Facebook).
  const atMaxDepth = depth >= MAX_DEPTH
  const replyParentId = atMaxDepth ? (comment.parentId ?? comment.id) : comment.id
  const replyPrefill = atMaxDepth ? `@${comment.author?.fullName ?? 'Ẩn danh'} ` : undefined

  const handleReplyClick = () => {
    if (!isAuthenticated) {
      navigate(loginRedirect())
      return
    }
    setReplying(v => !v)
  }

  return (
    <div>
      <div className="flex gap-3 border-t border-neutral-2 px-1 py-[18px] first:border-t-0">
        <Avatar name={comment.author?.fullName} src={comment.author?.avatar} size={32} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-neutral-8">
              {comment.author?.fullName ?? 'Ẩn danh'}
            </span>
            <span className="text-xs text-neutral-4">{formatRelative(comment.createdAt)}</span>
            {comment.isEdited && <span className="text-[11px] text-neutral-4">(đã sửa)</span>}
          </div>

          <div
            className="prose max-w-none text-sm text-neutral-8"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />

          <button
            onClick={handleReplyClick}
            className="mt-1.5 flex items-center gap-1 text-xs text-neutral-5 transition-colors hover:text-neutral-8"
          >
            <MessageSquare className="h-[13px] w-[13px]" />
            Trả lời
          </button>

          {replying && (
            <ReplyBox
              threadId={threadId}
              parentId={replyParentId}
              initialValue={replyPrefill}
              onDone={() => {
                setReplying(false)
                onReplied(replyParentId)
              }}
              onCancel={() => setReplying(false)}
            />
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className={depth < MAX_DEPTH ? 'ml-7 border-l border-neutral-2 pl-4' : ''}>
          {isExpanded ? (
            <>
              {replies.map(reply => (
                <CommentNode
                  key={reply.id}
                  comment={reply}
                  threadId={threadId}
                  depth={depth + 1}
                  expandedIds={expandedIds}
                  onToggleExpand={onToggleExpand}
                  onReplied={onReplied}
                />
              ))}
              <button
                onClick={() => onToggleExpand(comment.id)}
                className="flex items-center gap-1.5 rounded-lg py-2 text-[13px] font-medium text-neutral-5 transition-colors hover:text-neutral-8"
              >
                Ẩn phản hồi
              </button>
            </>
          ) : (
            <button
              onClick={() => onToggleExpand(comment.id)}
              className="flex items-center gap-1.5 rounded-lg py-2 text-[13px] font-medium text-neutral-6 transition-colors hover:text-neutral-8"
            >
              <CornerDownRight className="h-3.5 w-3.5" />
              Xem {countComments(replies)} phản hồi
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── root composer ──────────────────────────────────────────────────────────────

const Composer = ({
  threadId,
  locked,
  onPosted,
}: {
  threadId: string
  locked: boolean
  onPosted: () => void
}) => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 22 * 12)}px`
  }

  const submit = async () => {
    const content = value.trim()
    if (!content || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await createComment(threadId, content)
      setValue('')
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
      onPosted()
    } catch {
      setError('Không thể gửi bình luận. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (locked) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-neutral-3 bg-neutral-1 px-5 py-3 text-sm text-neutral-5">
        <Lock className="h-4 w-4 shrink-0" />
        Chủ đề này đã bị khóa — không thể bình luận thêm.
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-primary-2 bg-primary-1 px-6 py-5">
        <p className="mb-1 text-sm font-semibold text-neutral-8">Tham gia thảo luận</p>
        <p className="mb-4 text-sm text-neutral-6">
          Đăng nhập để bình luận và chia sẻ kiến thức y khoa
        </p>
        <button
          onClick={() => navigate(loginRedirect())}
          className="rounded-lg bg-primary-6 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-7"
        >
          Đăng nhập
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-3 bg-white">
      <div className="flex gap-3 px-4 pt-4">
        <Avatar name={user?.fullName} src={user?.avatarUrl} size={32} />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => {
            setValue(e.target.value)
            autoResize()
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              void submit()
            }
          }}
          rows={3}
          placeholder="Viết bình luận của bạn…"
          disabled={submitting}
          className="w-full resize-none pt-1 text-sm text-neutral-9 placeholder:text-neutral-4 focus:outline-none disabled:opacity-60"
        />
      </div>
      <div className="flex items-center justify-between border-t border-neutral-2 px-4 py-2.5">
        <span className="text-xs text-neutral-4">Ctrl + Enter để gửi nhanh</span>
        <button
          onClick={() => void submit()}
          disabled={!value.trim() || submitting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-6 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-7 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          {submitting ? 'Đang gửi…' : 'Gửi'}
        </button>
      </div>
      {error && <p className="px-4 pb-3 text-xs text-error-5">{error}</p>}
    </div>
  )
}

// ─── replies section ─────────────────────────────────────────────────────────────

const RepliesSection = ({ thread }: { thread: ForumThread }) => {
  const [comments, setComments] = useState<ForumComment[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleRootCount, setVisibleRootCount] = useState(ROOT_PAGE_SIZE)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    try {
      setComments(await getThreadComments(thread.id))
    } catch {
      // keep previous list; error surfaced by empty state
    } finally {
      setLoading(false)
    }
  }, [thread.id])

  useEffect(() => {
    void load()
  }, [load])

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Giữ nhánh vừa reply ở trạng thái mở để thấy comment mới sau reload.
  const handleReplied = useCallback(
    (parentId: string) => {
      setExpandedIds(prev => new Set(prev).add(parentId))
      void load()
    },
    [load],
  )

  const visibleRoots = comments.slice(0, visibleRootCount)
  const hiddenRootCount = comments.length - visibleRoots.length

  return (
    <section className="mt-7">
      <h2 className="mb-4 text-base font-semibold text-neutral-9">
        Bình luận{' '}
        <span className="font-normal text-neutral-4 tabular-nums">{countComments(comments)}</span>
      </h2>

      <Composer threadId={thread.id} locked={thread.isLocked} onPosted={load} />

      {loading ? (
        <div className="mt-3 flex flex-col gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex gap-3 py-2">
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-neutral-2" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-neutral-2" />
                <div className="h-3 w-full animate-pulse rounded bg-neutral-2" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-2" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="py-12 text-center">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-neutral-3" />
          <p className="mb-1 text-sm font-semibold text-neutral-6">Chưa có bình luận nào</p>
          <p className="text-xs text-neutral-4">Hãy là người đầu tiên chia sẻ ý kiến</p>
        </div>
      ) : (
        <div className="mt-2">
          {visibleRoots.map(c => (
            <CommentNode
              key={c.id}
              comment={c}
              threadId={thread.id}
              depth={0}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onReplied={handleReplied}
            />
          ))}
          {hiddenRootCount > 0 && (
            <button
              onClick={() => setVisibleRootCount(c => c + ROOT_PAGE_SIZE)}
              className="mt-2 w-full rounded-lg border border-neutral-3 py-2.5 text-sm font-medium text-neutral-6 transition-colors hover:bg-neutral-1"
            >
              Xem thêm {hiddenRootCount} bình luận
            </button>
          )}
        </div>
      )}
    </section>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export const ForumThreadDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setLeftSidebar, setRightSidebar, setBanner } = useLayout()
  const threadState = useAsyncState<ForumThread>()
  const [subCategory, setSubCategory] = useState<ForumSubCategory | null>(null)

  useEffect(() => {
    setLeftSidebar(null)
    setRightSidebar(null)
    setBanner(null)
    return () => setBanner(null)
  }, [setLeftSidebar, setRightSidebar, setBanner])

  useEffect(() => {
    if (!id) return
    void threadState.execute(async () => {
      const thread = await getThreadById(id)
      getSubCategoryById(thread.subCategoryId)
        .then(setSubCategory)
        .catch(() => {
          // fallback: show back button only
        })
      return thread
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const thread = threadState.state.data

  return (
    <div className="bg-neutral-2 pb-12">
      <div className="container mx-auto px-4 pt-5">
        <div className="mx-auto max-w-[760px]">
          <AsyncLoading
            loading={threadState.state.loading}
            type="skeleton"
            skeleton={{ rows: 8, title: true, avatar: true }}
          >
            {threadState.state.error ? (
              <div className={`rounded-[18px] bg-white px-6 py-14 text-center ${SOFT_SHADOW}`}>
                <p className="mb-3 text-sm text-neutral-5">{threadState.state.error}</p>
                <button
                  onClick={() => navigate(RouteConfig.ForumPage.path)}
                  className="text-sm text-primary-7 underline transition-colors hover:text-primary-8"
                >
                  Quay về diễn đàn
                </button>
              </div>
            ) : thread ? (
              <>
                <Breadcrumb thread={thread} subCategory={subCategory} />
                <ThreadArticle thread={thread} />
                <RepliesSection thread={thread} />
              </>
            ) : null}
          </AsyncLoading>
        </div>
      </div>
    </div>
  )
}

export default ForumThreadDetailPage
