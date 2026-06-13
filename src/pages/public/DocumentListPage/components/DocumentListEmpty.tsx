import { Empty } from 'antd'

interface DocumentListEmptyProps {
  keyword?: string
}

export const DocumentListEmpty = ({ keyword }: DocumentListEmptyProps) => {
  const description = keyword
    ? `Không tìm thấy tài liệu phù hợp với từ khóa "${keyword}".`
    : 'Chưa có tài liệu phù hợp với bộ lọc hiện tại.'

  return (
    <div className="rounded-xl border border-dashed border-neutral-3 bg-white px-4 py-16">
      <Empty description={description} />
    </div>
  )
}
