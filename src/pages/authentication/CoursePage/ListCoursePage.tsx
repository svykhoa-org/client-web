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
      {/* Page header */}
      <div className="mb-6 flex items-center gap-3">
        <BookOutlined className="text-2xl text-blue-500" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Khoá học E-Learning</h1>
          <p className="text-sm text-gray-500">
            Nâng cao kiến thức y khoa với các khoá học chuyên sâu
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={handleSearchChange}
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm kiếm khoá học..."
          className="sm:max-w-xs"
          allowClear
        />
        <div className="flex items-center gap-3">
          {!isLoading && (
            <span className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{total}</span> khoá học
            </span>
          )}
          <Select<SortOption>
            value={sort}
            onChange={handleSortChange}
            options={sortOptions}
            className="w-40"
          />
        </div>
      </div>

      {/* Course grid */}
      {isLoading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} lg={8}>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <Skeleton.Image active className="!h-36 !w-full" />
                <div className="p-4">
                  <Skeleton active paragraph={{ rows: 2 }} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : courses.length === 0 ? (
        <Empty
          description={
            debouncedSearch
              ? `Không tìm thấy khoá học nào cho "${debouncedSearch}"`
              : 'Chưa có khoá học nào'
          }
          className="py-16"
        />
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
