import React from 'react'

import { BRAND_NAME } from '@/constants/brand'

// "About" and "Mission & Vision" merged into one section, kept in the original
// two-card layout. Both columns hold three items of near-identical length
// (~76-83 chars each) so the cards end at the same height. Copy describes only
// what the platform ships today; the one aspirational claim is the vision.
const columns = [
  {
    title: `Về ${BRAND_NAME}`,
    subtitle: 'Những gì chúng tôi mang đến',
    barClass: 'bg-primary-6',
    badgeClass: 'bg-primary-1 text-primary-7',
    items: [
      {
        title: 'Tri thức chuyên ngành',
        description:
          'Tàng kinh các tài liệu, phác đồ điều trị và ca lâm sàng Răng Hàm Mặt được chọn lọc.',
      },
      {
        title: 'Đào tạo liên tục',
        description: 'Khoá học E-Learning chuyên sâu, học theo tiến độ riêng, nhận chứng chỉ CME.',
      },
      {
        title: 'Cộng đồng & nghề nghiệp',
        description:
          'Diễn đàn hỏi đáp ca khó, cập nhật văn bản pháp luật và cơ hội tuyển dụng nha khoa.',
      },
    ],
  },
  {
    title: 'Sứ mệnh & Tầm nhìn',
    subtitle: 'Định hướng phát triển',
    barClass: 'bg-accent-5',
    badgeClass: 'bg-accent-5/15 text-accent-6',
    items: [
      {
        title: 'Sứ mệnh',
        description:
          'Nâng chuẩn thực hành nha khoa Việt Nam bằng tri thức cập nhật và đào tạo liên tục.',
      },
      {
        title: 'Tầm nhìn',
        description:
          'Trở thành hệ sinh thái tri thức và đào tạo nha khoa được tin cậy hàng đầu Việt Nam.',
      },
      {
        title: 'Kết nối',
        description:
          'Gắn kết bác sĩ, sinh viên, cơ sở đào tạo và phòng khám trong cùng một hệ sinh thái.',
      },
    ],
  },
]

export const AboutUs: React.FC = () => {
  return (
    <section>
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold tracking-widest text-primary-6 uppercase">
          Về chúng tôi
        </p>
        <h2 className="text-3xl font-bold text-neutral-10">Hệ sinh thái nha khoa DSC</h2>
        <p className="mt-3 text-sm leading-relaxed text-balance text-neutral-6">
          {BRAND_NAME} (Dental Solution Center) đồng hành cùng bác sĩ, sinh viên và phòng khám Răng
          Hàm Mặt trên mọi chặng đường nghề nghiệp.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {columns.map(column => (
          <div
            key={column.title}
            className="rounded-xl border border-neutral-3 bg-white p-8 shadow-sm"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className={`h-8 w-1 rounded-full ${column.barClass}`} />
              <div>
                <h3 className="text-base font-bold text-neutral-10">{column.title}</h3>
                <p className="text-xs text-neutral-5">{column.subtitle}</p>
              </div>
            </div>
            <div className="space-y-5">
              {column.items.map((item, i) => (
                <div key={item.title} className="flex gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${column.badgeClass}`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="mb-0.5 text-sm font-semibold text-neutral-10">{item.title}</p>
                    <p className="text-xs leading-relaxed text-neutral-6">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
