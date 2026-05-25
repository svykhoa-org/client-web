import { useCallback, useEffect, useRef, useState } from 'react'

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Empty, Input, Spin, Tooltip } from 'antd'

import {
  useAppendLessonNote,
  useLessonNotes,
  useRemoveLessonNoteItem,
} from '@/lib/tanstack-query'

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
  currentTime: number
  onSeek: (seconds: number) => void
}

export function LessonNotesTab({ lessonId, currentTime, onSeek }: LessonNotesTabProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [draftContent, setDraftContent] = useState('')
  const [draftTimestamp, setDraftTimestamp] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { data: noteRows = [], isLoading } = useLessonNotes(lessonId, !!lessonId)
  const { mutate: appendNote, isPending: isSaving } = useAppendLessonNote(lessonId)
  const { mutate: removeItem, isPending: isRemoving } = useRemoveLessonNoteItem(lessonId)

  useEffect(() => {
    setIsAdding(false)
    setDraftContent('')
  }, [lessonId])

  const handleStartAdding = useCallback(() => {
    setDraftTimestamp(currentTime)
    setDraftContent('')
    setIsAdding(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }, [currentTime])

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
            className="rounded-lg border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-500"
          >
            Thêm ghi chú tại{' '}
            <span className="ml-1 font-mono font-semibold text-blue-600">
              {formatTimestamp(currentTime)}
            </span>
          </Button>
        </div>
      )}

      {isAdding && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <button
              onClick={() => onSeek(draftTimestamp)}
              className="cursor-pointer rounded bg-blue-100 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 hover:bg-blue-200 transition-colors"
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

          <div className="mt-4 flex items-center justify-between border-t border-blue-100 pt-3">
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
            <span className="text-sm text-slate-400">
              Chưa có ghi chú nào. Nhấn &quot;Thêm ghi chú&quot; để bắt đầu.
            </span>
          }
        />
      ) : (
        <div className="space-y-2">
          {flatNotes.map(note => (
            <div
              key={note.key}
              className="group flex items-start gap-3 rounded-lg border border-slate-100 bg-white p-4 hover:border-slate-200 transition-colors"
            >
              <button
                onClick={() => onSeek(note.timestamp)}
                className="shrink-0 cursor-pointer rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                {formatTimestamp(note.timestamp)}
              </button>
              <p className="flex-1 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
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
