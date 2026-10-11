import { useNavigate } from 'react-router'

import { ArrowRight, Check, FileText, GraduationCap, MessageCircle } from 'lucide-react'

import heroImage from '@/assets/images/hero-dental-academy.jpg'
import RouteConfig from '@/constants/RouteConfig'
import { RoutePath } from '@/routes'

// Real value points shown as text (plan 0014, Q2: keep the design's ribbon
// layout but with honest copy — no fabricated metrics).
const VALUE_POINTS = [
  'Chuẩn ADA, FDI & Bộ Y Tế',
  'Phác đồ điều trị tham chiếu quốc tế',
  'Cố vấn chuyên môn Răng Hàm Mặt',
  'Tài liệu & khóa học cập nhật liên tục',
]

const HomeHero = () => {
  const navigate = useNavigate()

  return (
    // Full-bleed dark banner. -mt-4 counteracts MainLayout's py-4; the 100vw +
    // negative margin trick escapes the centered container (same technique as
    // the previous hero).
    <section
      className="relative -mt-4 overflow-hidden text-white"
      style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}
    >
      {/* Background image + readability overlays (token-based gradients) */}
      <img
        src={heroImage}
        alt="Sinh viên nha khoa thực hành trên mô hình trong phòng đào tạo tiền lâm sàng"
        className="absolute inset-0 h-full w-full scale-105 object-cover"
      />
      <div className="from-primary-10/95 via-primary-10/80 to-primary-10/40 absolute inset-0 bg-gradient-to-r" />
      <div className="from-neutral-10/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left — headline & CTAs */}
          <div className="space-y-6 lg:col-span-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-accent-3 uppercase backdrop-blur-md">
              <span className="bg-accent-5 h-2 w-2 animate-pulse rounded-full" />
              Nền tảng tri thức & đào tạo nha khoa
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              Đồng hành cùng chuyên gia&nbsp;& <br className="hidden sm:inline" />
              <span className="from-accent-3 via-secondary-2 bg-gradient-to-r to-white bg-clip-text text-transparent">
                bác sĩ Răng Hàm Mặt Việt&nbsp;Nam
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-pretty text-neutral-2 sm:text-lg">
              Tàng kinh các tài liệu, phác đồ điều trị và khóa đào tạo chuyên sâu — hỗ trợ bác sĩ và
              sinh viên Răng Hàm Mặt trong thực hành lâm sàng hằng ngày.
            </p>

            {/* CTAs → real routes */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate(RoutePath.DocumentListPage.path)}
                className="from-primary-6 to-accent-6 hover:from-primary-7 hover:to-accent-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5"
              >
                Khám phá Tàng kinh các
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => navigate(RouteConfig.CoursePage.path)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                <GraduationCap size={16} className="text-accent-3" />
                Đăng ký khóa đào tạo
              </button>
              <button
                type="button"
                onClick={() => navigate(RouteConfig.ForumPage.path)}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-3.5 text-sm font-semibold text-accent-3 transition hover:text-white"
              >
                Tham gia diễn đàn chuyên môn
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Right — two value cards (honest copy, link to real sections) */}
          <div className="space-y-4 lg:col-span-4">
            <button
              type="button"
              onClick={() => navigate(RoutePath.DocumentListPage.path)}
              className="hover:border-accent-5/50 block w-full rounded-2xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="from-accent-6 to-primary-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr text-white">
                  <FileText size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">Tàng kinh các</p>
                  <p className="text-xs text-neutral-3">
                    Tra cứu tài liệu chuyên môn & ca lâm sàng
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate(RouteConfig.ForumPage.path)}
              className="hover:border-accent-5/50 block w-full rounded-2xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="bg-accent-5/20 text-accent-3 border-accent-5/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
                  <MessageCircle size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">Diễn đàn hỏi–đáp chuyên môn</p>
                  <p className="text-xs text-neutral-3">Trao đổi ca khó cùng cộng đồng bác sĩ</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Value ribbon — text points, no fabricated numbers (plan 0014) */}
        <div className="mt-14 grid grid-cols-1 gap-4 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_POINTS.map(point => (
            <div key={point} className="flex items-center gap-2.5">
              <span className="bg-accent-5/20 text-accent-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                <Check size={14} />
              </span>
              <span className="text-sm font-medium text-neutral-2">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeHero
