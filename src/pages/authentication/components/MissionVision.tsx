import React from 'react'

const missionItems = [
  {
    title: 'Hỗ trợ học tập hiệu quả',
    description:
      'Cung cấp tài liệu, bài giảng và nguồn học liệu chất lượng cao, giúp sinh viên y khoa tiếp cận kiến thức một cách dễ dàng.',
  },
  {
    title: 'Kết nối cộng đồng y khoa',
    description:
      'Tạo cầu nối giữa sinh viên y khoa trên toàn quốc, chia sẻ kinh nghiệm và hỗ trợ nhau trong học tập.',
  },
  {
    title: 'Phát triển kỹ năng tương lai',
    description:
      'Hỗ trợ sinh viên phát triển kỹ năng chuyên môn và soft skills, chuẩn bị tốt nhất cho sự nghiệp y tế.',
  },
]

const visionItems = [
  {
    title: 'Nền tảng hàng đầu Việt Nam',
    description:
      'Trở thành nền tảng học tập trực tuyến số 1 cho sinh viên y khoa tại Việt Nam, được tin tưởng và sử dụng rộng rãi.',
  },
  {
    title: 'Cộng đồng toàn diện và gắn kết',
    description:
      'Xây dựng hệ sinh thái học tập hoàn chỉnh, nơi sinh viên y khoa có thể học hỏi, chia sẻ và phát triển cùng nhau.',
  },
  {
    title: 'Đổi mới giáo dục y khoa',
    description:
      'Tiên phong ứng dụng công nghệ hiện đại trong giáo dục y khoa, tạo ra những trải nghiệm học tập tương tác và hiệu quả.',
  },
]

const coreValues = [
  {
    title: 'Đáng tin cậy',
    description: 'Thông tin chính xác, được kiểm chứng bởi các chuyên gia y tế và giảng viên.',
  },
  {
    title: 'Đổi mới',
    description: 'Không ngừng cải tiến và áp dụng công nghệ mới để nâng cao trải nghiệm học tập.',
  },
  {
    title: 'Tận tâm',
    description: 'Đặt sự thành công trong học tập và phát triển của sinh viên y khoa lên hàng đầu.',
  },
]

export const MissionVision: React.FC = () => {
  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-semibold tracking-widest text-teal-600 uppercase">
          Định hướng phát triển
        </p>
        <h2 className="text-3xl font-bold text-gray-900">Sứ mệnh và tầm nhìn</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-[#f8fafc] p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-teal-500" />
            <div>
              <h3 className="text-base font-bold text-gray-900">Sứ mệnh</h3>
              <p className="text-xs text-gray-400">Những giá trị cốt lõi của chúng tôi</p>
            </div>
          </div>
          <div className="space-y-5">
            {missionItems.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-600">
                  {i + 1}
                </span>
                <div>
                  <p className="mb-0.5 text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-[#f8fafc] p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-sky-500" />
            <div>
              <h3 className="text-base font-bold text-gray-900">Tầm nhìn</h3>
              <p className="text-xs text-gray-400">Hướng phát triển trong tương lai</p>
            </div>
          </div>
          <div className="space-y-5">
            {visionItems.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600">
                  {i + 1}
                </span>
                <div>
                  <p className="mb-0.5 text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {coreValues.map((value, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-6 text-center">
            <h4 className="mb-2 text-sm font-semibold text-gray-800">{value.title}</h4>
            <p className="text-xs leading-relaxed text-gray-500">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
