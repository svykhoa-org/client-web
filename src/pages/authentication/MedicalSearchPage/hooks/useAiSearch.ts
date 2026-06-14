import { useCallback, useRef, useState } from 'react'

import { streamSearchAnswer } from '@/services/chatbot/streamSearchAnswer'
import { fetchRelatedCourses, fetchRelatedDocuments } from '@/services/Search/relatedResources'
import type { Document } from '@/models/Document'
import type { CourseApiItem } from '@/types/course-api'

export type AnswerStatus = 'idle' | 'streaming' | 'done' | 'error'

export interface AiSearchState {
  query: string
  answer: string
  status: AnswerStatus
  /** Latest lifecycle message (e.g. "Mình đang hiểu ý") shown before the first token. */
  statusMessage: string
  error: string | null
  courses: CourseApiItem[]
  documents: Document[]
  resourcesLoading: boolean
  /** Resources are revealed once the answer stream is done. */
  resourcesReady: boolean
}

const initialState: AiSearchState = {
  query: '',
  answer: '',
  status: 'idle',
  statusMessage: '',
  error: null,
  courses: [],
  documents: [],
  resourcesLoading: false,
  resourcesReady: false,
}

export const useAiSearch = () => {
  const [state, setState] = useState<AiSearchState>(initialState)
  const abortRef = useRef<AbortController | null>(null)

  const handleSearch = useCallback(async (rawQuery: string) => {
    const query = rawQuery.trim()
    if (!query) return

    // Cancel any in-flight stream before starting a new one.
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState({
      ...initialState,
      query,
      status: 'streaming',
      resourcesLoading: true,
    })

    // Fetch related resources in parallel with the answer stream.
    // They are kept hidden until the answer is done (resourcesReady).
    void Promise.allSettled([fetchRelatedCourses(query), fetchRelatedDocuments(query)]).then(
      ([coursesResult, documentsResult]) => {
        if (controller.signal.aborted) return
        setState(prev => ({
          ...prev,
          courses: coursesResult.status === 'fulfilled' ? coursesResult.value : [],
          documents: documentsResult.status === 'fulfilled' ? documentsResult.value : [],
          resourcesLoading: false,
        }))
      },
    )

    try {
      await streamSearchAnswer(query, {
        signal: controller.signal,
        onAnswer: fullAnswer => {
          setState(prev => ({ ...prev, answer: fullAnswer }))
        },
        onStatus: message => {
          setState(prev => (prev.answer ? prev : { ...prev, statusMessage: message }))
        },
        onDone: () => {
          setState(prev => ({ ...prev, status: 'done', resourcesReady: true }))
        },
      })

      // Some backends close the stream without an explicit `done` event.
      setState(prev =>
        prev.status === 'streaming' ? { ...prev, status: 'done', resourcesReady: true } : prev,
      )
    } catch (error) {
      if (controller.signal.aborted) return
      const message =
        error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định khi tìm kiếm'
      setState(prev => ({ ...prev, status: 'error', error: message }))
    }
  }, [])

  return { ...state, handleSearch }
}
