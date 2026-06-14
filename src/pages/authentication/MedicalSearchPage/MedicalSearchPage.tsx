import React, { useEffect, useRef } from 'react'

import { useLocation } from 'react-router'

import SearchBar from '@/components/common/Header/src/SearchBar'

import { AnswerPanel } from './components/AnswerPanel'
import { ResourceRail } from './components/ResourceRail'
import { useAiSearch } from './hooks/useAiSearch'
import './styles.css'

export const MedicalSearchPage: React.FC = () => {
  const location = useLocation()
  const startedFor = useRef<string | null>(null)

  const {
    query,
    answer,
    status,
    statusMessage,
    error,
    courses,
    documents,
    resourcesLoading,
    resourcesReady,
    handleSearch,
  } = useAiSearch()

  // Kick off the search passed from the Home hero (via navigation state),
  // guarded so React StrictMode's double-mount does not fire it twice.
  useEffect(() => {
    const initialQuery = (location.state as { searchQuery?: string } | null)?.searchQuery
    if (initialQuery && startedFor.current !== initialQuery) {
      startedFor.current = initialQuery
      handleSearch(initialQuery)
    }
  }, [location.state, handleSearch])

  const hasQuery = Boolean(query)

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6">
      {/* Search bar — shares a view-transition-name with the Home hero bar so it
          morphs from the centre of the screen up to here on navigation. */}
      <div
        className="mx-auto w-full max-w-2xl"
        style={{ viewTransitionName: 'medical-search-bar' }}
      >
        <SearchBar onSearch={handleSearch} />
      </div>

      {hasQuery ? (
        <div className="msearch-grid mt-8">
          {/* The submitted question lives here as the heading, so the search
              input is cleared after submit. */}
          <h1 className="msearch-question text-2xl font-bold leading-snug text-neutral-10 sm:text-3xl">
            {query}
          </h1>

          <div className="mt-6">
            <AnswerPanel
              status={status}
              answer={answer}
              statusMessage={statusMessage}
              error={error}
              onRetry={() => handleSearch(query)}
            />
          </div>

          {/* Related resources as a lightweight suggestion section below the answer. */}
          <ResourceRail
            courses={courses}
            documents={documents}
            loading={resourcesLoading}
            ready={resourcesReady}
          />
        </div>
      ) : (
        <div className="mx-auto mt-16 max-w-md text-center">
          <h1 className="text-xl font-bold text-neutral-9">Bạn muốn tìm hiểu điều gì?</h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-6">
            Nhập triệu chứng, tên bệnh hoặc câu hỏi y khoa. Trợ lý AI sẽ tổng hợp câu trả lời và gợi
            ý khóa học, tài liệu liên quan.
          </p>
        </div>
      )}
    </div>
  )
}
