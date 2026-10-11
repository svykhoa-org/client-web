import React from 'react'

import { Carousel } from 'antd'

import bvRhmTwHanoi from '@/assets/images/partners/bv-rhm-tw-hanoi.png'
import bvRhmTwHcm from '@/assets/images/partners/bv-rhm-tw-hcm.png'
import dhPhanChauTrinh from '@/assets/images/partners/dh-phan-chau-trinh.png'
import dhYDuocCanTho from '@/assets/images/partners/dh-y-duoc-can-tho.png'
import dhYDuocHue from '@/assets/images/partners/dh-y-duoc-hue.png'
import dhYDuocThaiBinh from '@/assets/images/partners/dh-y-duoc-thai-binh.png'
import hoiRhmVietNam from '@/assets/images/partners/hoi-rhm-viet-nam.png'
import khoaRhmUmp from '@/assets/images/partners/khoa-rhm-ump.png'
import vienDaoTaoRhmHmu from '@/assets/images/partners/vien-dao-tao-rhm-hmu.png'

// Logos are self-hosted (taken from each partner's official website) so the
// carousel never depends on a third-party host staying up.
// Each name is pre-split into two lines at a meaningful break (institution
// type / proper name) so it never wraps mid-phrase at arbitrary widths.
const partners = [
  { lines: ['Bệnh viện Răng Hàm Mặt', 'Trung ương Hà Nội'], logo: bvRhmTwHanoi },
  { lines: ['Bệnh viện Răng Hàm Mặt', 'Trung ương TP. Hồ Chí Minh'], logo: bvRhmTwHcm },
  { lines: ['Viện Đào tạo Răng Hàm Mặt', 'Trường Đại học Y Hà Nội'], logo: vienDaoTaoRhmHmu },
  { lines: ['Khoa Răng Hàm Mặt', 'Trường Đại học Y Dược TP.HCM'], logo: khoaRhmUmp },
  { lines: ['Trường Đại học', 'Y Dược Thái Bình'], logo: dhYDuocThaiBinh },
  { lines: ['Trường Đại học', 'Y Dược Cần Thơ'], logo: dhYDuocCanTho },
  { lines: ['Trường Đại học Y Dược', 'Đại học Huế'], logo: dhYDuocHue },
  { lines: ['Trường Đại học', 'Phan Châu Trinh'], logo: dhPhanChauTrinh },
  { lines: ['Hội Răng Hàm Mặt', 'Việt Nam'], logo: hoiRhmVietNam },
]

export const PartnersCarousel: React.FC = () => {
  return (
    <section>
      <div>
        <div className="mb-8 text-center">
          <h4 className="mb-3 text-xl font-semibold text-gray-800">Đối tác tin cậy</h4>
          <p className="mx-auto max-w-2xl text-sm text-balance text-gray-600">
            Đồng hành cùng các bệnh viện, cơ sở đào tạo và hội chuyên ngành Răng Hàm Mặt hàng đầu
            Việt Nam
          </p>
        </div>

        <Carousel
          autoplay={true}
          autoplaySpeed={3000}
          slidesToShow={4}
          slidesToScroll={1}
          infinite={true}
          pauseOnHover={true}
          responsive={[
            // 3-up below 1024px: at 4-up each slide is ~180px and the
            // two-line names start wrapping mid-phrase.
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
        >
          {partners.map(partner => (
            <div key={partner.lines.join(' ')} className="px-2">
              <div className="text-center">
                {/* Fixed box + object-contain: round seals and wide wordmarks
                    (e.g. Huế) render at a comparable visual weight. */}
                <div className="mx-auto flex h-24 w-full max-w-56 items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.lines.join(' ')}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {/* Two fixed lines: same height for every card, logos stay aligned */}
                <p className="mt-3 text-sm leading-snug font-medium text-neutral-8">
                  {partner.lines.map(line => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}
