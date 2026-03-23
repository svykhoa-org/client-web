import { Empty } from 'antd'

interface DocumentListEmptyProps {
  keyword?: string
}

export const DocumentListEmpty = ({ keyword }: DocumentListEmptyProps) => {
  const description = keyword
    ? `Không tìm thấy tài liệu phù hợp với từ khóa "${keyword}".`
    : 'Chưa có tài liệu phù hợp với bộ lọc hiện tại.'

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12">
      <Empty description={description} />
    </div>
  )
}
