import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/tanstack-query'
import {
  appendLessonNote,
  getLessonNotes,
  removeLessonNoteItem,
  updateLessonNoteItem,
} from '@/services/LessonNote/lessonNoteService'

export const useLessonNotes = (lessonId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.lessonNotes.list(lessonId),
    queryFn: () => getLessonNotes(lessonId),
    enabled: enabled && !!lessonId,
    staleTime: 1000 * 60,
  })
}

export const useAppendLessonNote = (lessonId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      timestampSeconds,
      content,
    }: {
      timestampSeconds: number | null
      content: string
    }) => appendLessonNote(lessonId, timestampSeconds, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonNotes.list(lessonId) })
    },
  })
}

export const useUpdateLessonNoteItem = (lessonId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      noteId,
      itemIndex,
      content,
    }: {
      noteId: string
      itemIndex: number
      content: string
    }) => updateLessonNoteItem(noteId, itemIndex, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonNotes.list(lessonId) })
    },
  })
}

export const useRemoveLessonNoteItem = (lessonId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ noteId, itemIndex }: { noteId: string; itemIndex: number }) =>
      removeLessonNoteItem(noteId, itemIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonNotes.list(lessonId) })
    },
  })
}
