import { useState } from 'react'

import { BookOutlined, SearchOutlined } from '@ant-design/icons'
import { Col, Empty, Input, Pagination, Row, Select, Skeleton } from 'antd'

import { useDebounceValue } from '@/hooks/useDebounce'
import { useListCourses } from '@/lib/tanstack-query/hooks/useCourseQueries'

import { CourseItem } from './components/CourseItem'

const PAGE_SIZE = 12

type SortOption = 'createdAt:DESC' | 'createdAt:ASC' | 'price:ASC' | 'price:DESC'

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Mới nhất', value: 'createdAt:DESC' },
  { label: 'Cũ nhất', value: 'createdAt:ASC' },
  { label: 'Giá tăng dần', value: 'price:ASC' },
  { label: 'Giá giảm dần', value: 'price:DESC' },
]

export const ListCoursePage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('createdAt:DESC')

  const debouncedSearch = useDebounceValue(search, 400)

  const [sortField, sortDir] = sort.split(':') as ['createdAt' | 'price', 'ASC' | 'DESC']

  const { data, isLoading } = useListCourses({
    page,
    limit: PAGE_SIZE,
    title: debouncedSearch || undefined,
    sortCreatedAt: sortField === 'createdAt' ? sortDir : undefined,
    sortPrice: sortField === 'price' ? sortDir : undefined,
  })

  const courses = data?.items ?? []
  const total = data?.pagination?.totalItems ?? 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleSortChange = (value: SortOption) => {
    setSort(value)
    setPage(1)
  }

  return (
    <div className="w-full">
      {/* Page header + search toolbar */}
      <header className="mb-6 overflow-hidden rounded-2xl border border-neutral-3 bg-white">
        {/* Title band */}
        <div className="from-primary-1 bg-gradient-to-br to-white px-6 pb-5 pt-6 sm:px-8 sm:pt-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span className="bg-primary-9 shadow-primary-10/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl text-white shadow-sm">
                <BookOutlined />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-10 text-balance">
                  Khoá học E-Learning
                </h1>
                <p className="mt-1 max-w-prose text-sm text-neutral-6">
                  Nâng cao kiến thức y khoa với các khoá học chuyên sâu
                </p>
              </div>
            </div>
            {!isLoading && (
              <div className="shrink-0 text-right">
                <div className="text-primary-9 text-2xl font-bold leading-none tabular-nums">
                  {total}
                </div>
                <div className="mt-1 text-xs text-neutral-5">khoá học</div>
              </div>
            )}
          </div>
        </div>

        {/* Search + sort */}
        <div className="flex flex-col gap-3 border-t border-neutral-2 px-6 py-4 sm:flex-row sm:items-center sm:px-8">
          <Input
            value={search}
            onChange={handleSearchChange}
            prefix={<SearchOutlined className="text-neutral-5" />}
            placeholder="Tìm kiếm khoá học theo tên..."
            className="rounded-lg sm:flex-1"
            size="large"
            allowClear
          />
          <div className="flex items-center gap-2">
            <span className="hidden shrink-0 text-sm text-neutral-6 sm:inline">Sắp xếp</span>
            <Select<SortOption>
              value={sort}
              onChange={handleSortChange}
              options={sortOptions}
              size="large"
              className="w-full sm:w-44"
            />
          </div>
        </div>
      </header>

      {/* Course grid */}
      {isLoading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} lg={8}>
              <div className="overflow-hidden rounded-xl border border-neutral-3 bg-white">
                <Skeleton.Image active className="!aspect-video !h-auto !w-full" />
                <div className="p-4">
                  <Skeleton active paragraph={{ rows: 2 }} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : courses.length === 0 ? (
        <div className="rounded-xl border border-neutral-3 bg-white py-16">
          <Empty
            description={
              debouncedSearch
                ? `Không tìm thấy khoá học nào cho "${debouncedSearch}"`
                : 'Chưa có khoá học nào'
            }
          />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {courses.map(course => (
            <Col key={course.id} xs={24} sm={12} lg={8}>
              <CourseItem course={course} />
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="mt-8 flex justify-center">
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={setPage}
            showSizeChanger={false}
            showTotal={t => `Tổng ${t} khoá học`}
          />
        </div>
      )}
    </div>
  )
}
