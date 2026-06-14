import { useCallback, useEffect, useRef, useState } from 'react'

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Empty, Input, Spin, Tooltip } from 'antd'

import { useAppendLessonNote, useLessonNotes, useRemoveLessonNoteItem } from '@/lib/tanstack-query'

const { TextArea } = Input

function formatTimestamp(seconds: number): string {
  const s = Math.floor(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

interface LessonNotesTabProps {
  lessonId: string
  getCurrentTime: () => number
  onSeek: (seconds: number) => void
}

export function LessonNotesTab({ lessonId, getCurrentTime, onSeek }: LessonNotesTabProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [draftContent, setDraftContent] = useState('')
  const [draftTimestamp, setDraftTimestamp] = useState(0)
  const [liveTime, setLiveTime] = useState(() => getCurrentTime())
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isAdding) return
    const id = setInterval(() => setLiveTime(getCurrentTime()), 500)
    return () => clearInterval(id)
  }, [isAdding, getCurrentTime])

  const { data: noteRows = [], isLoading } = useLessonNotes(lessonId, !!lessonId)
  const { mutate: appendNote, isPending: isSaving } = useAppendLessonNote(lessonId)
  const { mutate: removeItem, isPending: isRemoving } = useRemoveLessonNoteItem(lessonId)

  useEffect(() => {
    setIsAdding(false)
    setDraftContent('')
  }, [lessonId])

  const handleStartAdding = useCallback(() => {
    setDraftTimestamp(getCurrentTime())
    setDraftContent('')
    setIsAdding(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }, [getCurrentTime])

  const handleSave = useCallback(() => {
    const trimmed = draftContent.trim()
    if (!trimmed) {
      setIsAdding(false)
      return
    }
    appendNote(
      { timestampSeconds: Math.floor(draftTimestamp), content: trimmed },
      {
        onSuccess: () => {
          setIsAdding(false)
          setDraftContent('')
        },
      },
    )
  }, [appendNote, draftContent, draftTimestamp])

  const handleCancel = useCallback(() => {
    setIsAdding(false)
    setDraftContent('')
  }, [])

  const flatNotes = noteRows
    .flatMap(row =>
      (row.contents ?? []).map((content, idx) => ({
        key: `${row.id}-${idx}`,
        noteId: row.id,
        itemIndex: idx,
        timestamp: row.timestampSeconds ?? 0,
        content,
        createdAt: row.createdAt,
      })),
    )
    .sort((a, b) => a.timestamp - b.timestamp)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    )
  }

  return (
    <div className="py-4 space-y-4">
      {!isAdding && (
        <div className="flex items-center gap-3">
          <Button
            icon={<PlusOutlined />}
            onClick={handleStartAdding}
            className="rounded-lg border-neutral-3 text-neutral-7 hover:border-primary-5 hover:text-primary-6"
          >
            Thêm ghi chú tại{' '}
            <span className="ml-1 font-mono font-semibold text-primary-7">
              {formatTimestamp(liveTime)}
            </span>
          </Button>
        </div>
      )}

      {isAdding && (
        <div className="rounded-lg border border-primary-3 bg-primary-1 p-4">
          <div className="mb-3 flex items-center gap-2">
            <button
              onClick={() => onSeek(draftTimestamp)}
              className="cursor-pointer rounded bg-primary-2 px-2 py-0.5 font-mono text-xs font-semibold text-primary-8 transition-colors hover:bg-primary-3"
            >
              {formatTimestamp(draftTimestamp)}
            </button>
            <span className="text-xs text-slate-400">Nhấn để xem lại thời điểm này</span>
          </div>

          <TextArea
            ref={textareaRef as React.Ref<HTMLTextAreaElement>}
            value={draftContent}
            onChange={e => setDraftContent(e.target.value)}
            placeholder="Nhập ghi chú của bạn..."
            autoSize={{ minRows: 3, maxRows: 8 }}
            className="rounded-lg border-slate-200 text-sm"
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
              if (e.key === 'Escape') handleCancel()
            }}
          />

          <div className="mt-4 flex items-center justify-between border-t border-primary-2 pt-3">
            <span className="text-xs text-slate-400">⌘ + Enter để lưu · Esc để huỷ</span>
            <div className="flex gap-2">
              <Button onClick={handleCancel} className="rounded-lg">
                Huỷ
              </Button>
              <Button
                type="primary"
                onClick={handleSave}
                loading={isSaving}
                disabled={!draftContent.trim()}
                className="rounded-lg"
              >
                Lưu ghi chú
              </Button>
            </div>
          </div>
        </div>
      )}

      {flatNotes.length === 0 && !isAdding ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-sm text-neutral-5">
              Chưa có ghi chú nào. Nhấn &quot;Thêm ghi chú&quot; để bắt đầu.
            </span>
          }
        />
      ) : (
        <div className="space-y-2">
          {flatNotes.map(note => (
            <div
              key={note.key}
              className="group flex items-start gap-3 rounded-lg border border-neutral-2 bg-white p-4 transition-colors hover:border-neutral-3"
            >
              <button
                onClick={() => onSeek(note.timestamp)}
                className="shrink-0 cursor-pointer rounded bg-neutral-2 px-2 py-0.5 font-mono text-xs font-semibold text-primary-7 transition-colors hover:bg-primary-1 hover:text-primary-8"
              >
                {formatTimestamp(note.timestamp)}
              </button>
              <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-neutral-8">
                {note.content}
              </p>
              <Tooltip title="Xoá ghi chú">
                <button
                  disabled={isRemoving}
                  onClick={() => removeItem({ noteId: note.noteId, itemIndex: note.itemIndex })}
                  className="shrink-0 cursor-pointer text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-rose-400 disabled:cursor-not-allowed"
                >
                  <DeleteOutlined />
                </button>
              </Tooltip>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
