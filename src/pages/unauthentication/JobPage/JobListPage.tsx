import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { Button, Modal } from 'antd'
import { Banknote, Briefcase, Building2, Clock, MapPin, Search, X } from 'lucide-react'

import Pagination from '@/components/ui/Pagination'
import RouteConfig from '@/constants/RouteConfig'
import { useListing } from '@/hooks/useCRUD/useListing'
import { useLayout } from '@/hooks/useLayout'
import type { Job } from '@/models/Job'
import { getJobList } from '@/services/Job/jobService'

import { FormRegistration } from './components/FormRegistration'

export const JobListPage = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const { setBanner, setLeftSidebar, setRightSidebar } = useLayout()

  const {
    data: jobs,
    isLoading,
    setSearchParams,
    page,
    limit,
    totalItems,
  } = useListing<Job>({
    defaultSearchParams: { page: 1, limit: 10 },
    getListService: async params => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const res = await getJobList(params)
      return {
        data: res.data.hits,
        totalItems: res.data.pagination.totalItems,
        totalPages: res.data.pagination.totalPages,
        page: res.data.pagination.currentPage,
        limit: res.data.pagination.itemsPerPage,
      }
    },
  })

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, search: value, page: 1 }))
  }

  const clearSearch = () => {
    setSearchValue('')
    setSearchParams(prev => ({ ...prev, search: '', page: 1 }))
  }

  const companyInitial = (name: string) => name.charAt(0).toUpperCase()

  const formatSalary = (salaryRange?: [number, number]) => {
    if (!salaryRange) return 'Thỏa thuận'
    return `${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()} VND`
  }

  useEffect(() => {
    setBanner(
      <div className="relative overflow-hidden bg-linear-to-br from-primary-9 via-primary-7 to-primary-5 py-10">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-white" />
          <div className="absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-white" />
          <div className="absolute right-1/3 top-1/2 h-28 w-28 rounded-full bg-white" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Briefcase className="h-7 w-7 text-white/80" />
            <h1 className="text-3xl font-bold text-white">Cơ hội nghề nghiệp Y dược</h1>
          </div>
          <p className="text-base text-white/80">
            Tìm kiếm vị trí phù hợp trong ngành y tế và dược phẩm Việt Nam
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/65">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              Bệnh viện và phòng khám
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              Công ty dược phẩm
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              Nghiên cứu và giảng dạy
            </span>
          </div>
        </div>
      </div>,
    )
    return () => {
      setBanner(null)
      setLeftSidebar(null)
      setRightSidebar(null)
    }
  }, [setBanner, setLeftSidebar, setRightSidebar])

  return (
    <>
      {/* Main content — already inside layout's container+mx-4 */}
      <div className="py-4">
        {/* Search bar */}
        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-4" />
            <input
              type="text"
              placeholder="Tìm kiếm công việc, công ty, vị trí..."
              value={searchValue}
              onChange={e => {
                setSearchValue(e.target.value)
                setTimeout(() => handleSearch(e.target.value), 500)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearch(searchValue)
              }}
              className="w-full rounded-lg border border-neutral-3 bg-white py-2.5 pl-9 pr-9 text-sm text-neutral-9 placeholder:text-neutral-4 focus:border-primary-5 focus:ring-2 focus:ring-primary-1 focus:outline-none"
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-4 transition-colors hover:text-neutral-6"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="primary" onClick={() => handleSearch(searchValue)} className="px-5">
            Tìm kiếm
          </Button>
        </div>

        {/* Job list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-neutral-3/40" />
            ))}
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map(item => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-neutral-3/60 bg-white transition-all duration-200 hover:border-primary-4 hover:shadow-[0_4px_20px_rgba(25,118,210,0.10)]"
              >
                <span className="absolute left-0 top-0 h-full w-0.5 bg-transparent transition-all duration-200 group-hover:bg-primary-5" />

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Company avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-1 text-lg font-bold text-primary-7">
                      {companyInitial(item.company)}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Title */}
                      <h3
                        className="cursor-pointer text-base font-semibold text-neutral-9 transition-colors hover:text-primary-6"
                        onClick={() =>
                          navigate(RouteConfig.JobDetailPage.path.replace(':id', item.id || ''))
                        }
                      >
                        {item.title}
                      </h3>

                      {/* Company + location */}
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-6">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 shrink-0" />
                          {item.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {item.location}
                        </span>
                      </div>

                      {/* Requirements chips */}
                      {item.requirements && item.requirements.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {item.requirements.slice(0, 3).map(req => (
                            <span
                              key={req}
                              className="rounded-md bg-primary-1 px-2 py-0.5 text-xs font-medium text-primary-7"
                            >
                              {req}
                            </span>
                          ))}
                          {item.requirements.length > 3 && (
                            <span className="rounded-md bg-neutral-2 px-2 py-0.5 text-xs text-neutral-5">
                              +{item.requirements.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Salary + expiry */}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-1 text-sm font-medium text-success-3">
                          <Banknote className="h-4 w-4" />
                          {formatSalary(item.salaryRange)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-neutral-5">
                          <Clock className="h-3.5 w-3.5" />
                          Hạn: {new Date(item.expiresAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-2 pt-3">
                        <Button
                          onClick={() =>
                            navigate(RouteConfig.JobDetailPage.path.replace(':id', item.id || ''))
                          }
                        >
                          Xem chi tiết
                        </Button>
                        <Button type="primary" onClick={() => setSelectedJob(item)}>
                          Ứng tuyển ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center py-6">
              <Pagination
                current={page}
                pageSize={limit}
                total={totalItems}
                onChange={p => setSearchParams(prev => ({ ...prev, page: p }))}
                showSizeChanger={false}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-3/60 bg-white px-8 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-2">
              <Briefcase className="h-8 w-8 text-neutral-4" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-neutral-8">
              Không tìm thấy công việc
            </h3>
            <p className="max-w-[280px] text-sm text-neutral-5">
              Thử tìm kiếm với từ khóa khác hoặc xem tất cả các vị trí hiện có.
            </p>
          </div>
        )}
      </div>

      {/* Apply modal */}
      <Modal
        open={!!selectedJob}
        title={
          <div className="text-primary-8 pb-2 text-center text-xl font-bold">
            {selectedJob?.title}
          </div>
        }
        footer={null}
        onCancel={() => setSelectedJob(null)}
        width={700}
      >
        <FormRegistration
          onSubmit={data => {
            console.log('Đã nộp đơn ứng tuyển cho công việc:', data)
          }}
          onSuccess={() => setSelectedJob(null)}
        />
      </Modal>
    </>
  )
}
