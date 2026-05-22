import { useParams } from 'react-router'

import { ExperimentOutlined } from '@ant-design/icons'
import { Result } from 'antd'

import RouteConfig from '@/constants/RouteConfig'

import { ListModuleSidebar } from './components/ListModuleSidebar'

export const CourseLearningPage = () => {
  const params = useParams()
  const courseId = params[RouteConfig.CourseLearningPage.paramKey.courseId]
  const lessonId = params[RouteConfig.CourseLearningPage.paramKey.lessonId]

  if (!courseId || !lessonId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Result
          status="warning"
          title="Bài học không hợp lệ"
          subTitle="Vui lòng chọn một bài học từ danh sách."
        />
      </div>
    )
  }

  return (
    <div className="-mx-4 flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Video placeholder */}
        <div className="flex aspect-video w-full items-center justify-center bg-gray-900">
          <div className="flex flex-col items-center gap-4 text-center">
            <ExperimentOutlined className="text-6xl text-yellow-400" />
            <div>
              <p className="text-xl font-bold text-white">Đang phát triển</p>
              <p className="mt-1 text-sm text-gray-400">Tính năng xem video sẽ sớm được ra mắt</p>
            </div>
          </div>
        </div>

        {/* Lesson info area */}
        <div className="flex-1 bg-white p-6">
          <p className="text-sm text-gray-500">Bài học ID: {lessonId}</p>
        </div>
      </div>

      {/* Module sidebar */}
      <div className="shrink-0 border-t border-gray-200 md:w-80 md:border-t-0">
        <div className="sticky top-0 h-[calc(100vh-64px)] overflow-hidden">
          <ListModuleSidebar />
        </div>
      </div>
    </div>
  )
}
