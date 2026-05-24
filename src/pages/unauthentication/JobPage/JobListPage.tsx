import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Button, Input, List, Modal, Space } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { useListing } from '@/hooks/useCRUD/useListing'
import type { Job } from '@/models/Job'
import { getJobList } from '@/services/Job/jobService'

import { FormRegistration } from './components/FormRegistration'

export const JobListPage = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const navigate = useNavigate()

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

  return (
    <>
      <Space direction="vertical" size="middle" className="w-full px-4">
        <div className="flex w-full justify-center">
          <Input.Search
            className="w-full max-w-[500px]"
            placeholder="Tìm kiếm công việc, công ty, vị trí..."
            enterButton
            allowClear
            onChange={e => {
              setTimeout(() => {
                setSearchParams(prev => ({ ...prev, search: e.target.value }))
              }, 500)
            }}
            onSearch={value => {
              setSearchParams(prev => ({ ...prev, search: value }))
            }}
            size="large"
          />
        </div>

        <List
          loading={isLoading}
          itemLayout="vertical"
          dataSource={jobs}
          locale={{ emptyText: 'Không có công việc' }}
          pagination={{
            current: page,
            pageSize: limit,
            total: totalItems,
            onChange: p => {
              setSearchParams(prev => ({ ...prev, page: p }))
            },
          }}
          renderItem={(item: Job) => (
            <div className="mb-4 rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:shadow-md">
              <div className="flex items-start gap-5 p-5">
                {/* Nội dung */}
                <div className="flex flex-1 flex-col">
                  {/* Tiêu đề công việc */}
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-blue-600">
                        {item.title}
                      </h3>

                      {/* Công ty + địa điểm */}
                      <p className="text-sm text-gray-600">
                        {item.company} · {item.location}
                      </p>
                    </div>
                    <div className="hidden gap-2 md:flex">
                      <Button
                        className="w-fit"
                        onClick={() =>
                          navigate(RouteConfig.JobDetailPage.path.replace(':id', item.id || ''))
                        }
                      >
                        Xem chi tiết
                      </Button>
                      <Button type="primary" className="w-fit" onClick={() => setSelectedJob(item)}>
                        Ứng tuyển ngay
                      </Button>
                    </div>
                  </div>

                  {/* Yêu cầu nổi bật */}
                  {item.requirements && item.requirements.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.requirements.slice(0, 3).map(req => (
                        <span
                          key={req}
                          className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-xs text-blue-600"
                        >
                          {req}
                        </span>
                      ))}
                      {item.requirements.length > 3 && (
                        <span className="rounded-md border bg-gray-50 px-2 py-1 text-xs text-gray-500">
                          +{item.requirements.length - 3} yêu cầu
                        </span>
                      )}
                    </div>
                  )}

                  {/* Lương + Hạn nộp */}
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {item.salaryRange
                        ? `${item.salaryRange[0].toLocaleString()} - ${item.salaryRange[1].toLocaleString()} VND`
                        : 'Lương thỏa thuận'}
                    </span>
                    <span>Hạn nộp: {new Date(item.expiresAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="mt-2 flex flex-col gap-2 md:hidden">
                    <Button
                      block
                      onClick={() =>
                        navigate(RouteConfig.JobDetailPage.path.replace(':id', item.id || ''))
                      }
                    >
                      Xem chi tiết
                    </Button>
                    <Button type="primary" block onClick={() => setSelectedJob(item)}>
                      Ứng tuyển ngay
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </Space>
      <Modal
        open={!!selectedJob}
        title={
          <div className="text-primary-8 pb-10 text-center text-xl font-bold">
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
