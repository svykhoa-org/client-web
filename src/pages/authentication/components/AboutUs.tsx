import React from 'react'

const features = [
  {
    number: '01',
    title: 'Tài liệu học tập',
    description:
      'Kho tài liệu y khoa phong phú với slide bài giảng, bài tập và tài liệu tham khảo cập nhật.',
  },
  {
    number: '02',
    title: 'Cộng đồng sinh viên',
    description: 'Kết nối và trao đổi kiến thức với hàng nghìn sinh viên y khoa trên toàn quốc.',
  },
  {
    number: '03',
    title: 'Học tập thông minh',
    description: 'Phương pháp học tập hiệu quả với quiz, flashcard và hệ thống theo dõi tiến độ.',
  },
  {
    number: '04',
    title: 'Phát triển sự nghiệp',
    description: 'Chuẩn bị cho tương lai với thông tin thực tập, nghiên cứu và cơ hội việc làm.',
  },
]

export const AboutUs: React.FC = () => {
  return (
    <section className="py-16">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <p className="mb-2 text-xs font-semibold tracking-widest text-teal-600 uppercase">
            Về chúng tôi
          </p>
          <h2 className="text-3xl font-bold leading-tight text-gray-900">Về SVYKHOA</h2>
        </div>
        <p className="max-w-lg text-sm leading-relaxed text-gray-500">
          Nền tảng học tập trực tuyến dành riêng cho sinh viên y khoa, giúp tìm kiếm thông tin và
          tài liệu y khoa dễ dàng và hiệu quả.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map(feature => (
          <div
            key={feature.number}
            className="group flex gap-5 rounded-xl border border-gray-100 bg-white p-6 transition-all duration-200 hover:border-teal-200 hover:shadow-md"
          >
            <span className="flex-shrink-0 text-3xl font-bold text-gray-100 transition-colors duration-200 group-hover:text-teal-100">
              {feature.number}
            </span>
            <div>
              <h3 className="mb-1.5 text-sm font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-xs leading-relaxed text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
