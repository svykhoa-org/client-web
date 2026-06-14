import { useNavigate } from 'react-router'

import { Carousel } from 'antd'

import SearchBar from '@/components/common/Header/src/SearchBar'
import RouteConfig from '@/constants/RouteConfig'

import { AboutUs, ExpertTeam, MissionVision, PartnersCarousel } from '../components'
import { ListArticles } from './components/ListArticles'
import { ListBulletins } from './components/ListBulletins'

export const HomePage = () => {
  const navigate = useNavigate()

  const handleSearch = (value: string) => {
    // `viewTransition` wraps the route swap in document.startViewTransition so the
    // search bar (shared `view-transition-name`) morphs from here up to /search.
    navigate(RouteConfig.MedicalSearchPage.path, {
      state: { searchQuery: value },
      viewTransition: true,
    })
  }

  return (
    <div>
      {/* Hero Section — full-bleed, -mt-4 counteracts layout py-4 */}
      <section
        className="relative -mt-4 pb-28 pt-24"
        style={{
          background: 'linear-gradient(180deg, #C8DBF7 0%, #DCE9FB 35%, #EDF3FC 65%, #f5f5f5 100%)',
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
        }}
      >
        {/* Blob container — overflow-hidden HERE để blobs bị clip, section thì không */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-blue-300/15 blur-3xl" />
          <div className="absolute right-1/4 bottom-12 h-64 w-64 rounded-full bg-blue-200/10 blur-3xl" />
        </div>

        {/* Bottom fade overlay — fade về đúng màu nền #f5f5f5 của body */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to bottom, transparent, #f5f5f5)' }}
        />

        {/* Decorative line-art — left corner: concentric scope rings */}
        <div
          className="pointer-events-none absolute bottom-16 left-8 hidden lg:block"
          style={{ opacity: 0.08, color: '#1976d2' }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
            <circle cx="90" cy="90" r="70" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="90" cy="90" r="46" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="90" cy="90" r="22" stroke="currentColor" strokeWidth="0.6" />
            <line x1="22" y1="90" x2="158" y2="90" stroke="currentColor" strokeWidth="0.8" />
            <line x1="90" y1="22" x2="90" y2="158" stroke="currentColor" strokeWidth="0.8" />
          </svg>
        </div>

        {/* Decorative line-art — right corner: EKG heartbeat */}
        <div
          className="pointer-events-none absolute top-10 right-8 hidden lg:block"
          style={{ opacity: 0.08, color: '#1976d2' }}
        >
          <svg width="220" height="80" viewBox="0 0 220 80" fill="none">
            <path
              d="M 0 40 L 35 40 L 50 10 L 65 70 L 80 22 L 95 40 L 220 40"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-3 text-xs font-semibold tracking-widest text-blue-700 uppercase">
              Nền tảng y khoa sinh viên
            </p>
            <h1 className="mb-5 text-5xl font-bold leading-tight tracking-tight text-gray-900">
              Tra cứu & tổng hợp thông tin y khoa <br />
              <span className="text-blue-700">chính xác và toàn diện</span>
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-600 font-medium">
              Tìm kiếm triệu chứng, bệnh lý với sự hỗ trợ từ chuyên gia AI
            </p>
            <div
              className="mx-auto w-full max-w-2xl"
              style={{ viewTransitionName: 'medical-search-bar' }}
            >
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* Content section kéo lên 24px để tạo overlap mềm với đáy hero */}
      <div className="relative z-10 -mt-6 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-8">
          <section className="col-span-1 lg:col-span-6">
            <Carousel autoplay className="mb-6 overflow-hidden rounded-xl">
              <div>
                <img
                  src="https://i.pinimg.com/736x/6c/4f/d0/6c4fd0ea9cb17aa05170f9c71255f20e.jpg"
                  className="h-64 w-full object-cover"
                  alt="Medical research environment"
                />
              </div>
              <div>
                <img
                  src="https://i.pinimg.com/736x/bb/10/f9/bb10f918a49e8ee1d315fce99aee7c02.jpg"
                  className="h-64 w-full object-cover"
                  alt="Medical team"
                />
              </div>
              <div>
                <img
                  src="https://i.pinimg.com/736x/a3/da/e0/a3dae00bc3985145bdc88db548f28265.jpg"
                  className="h-64 w-full object-cover"
                  alt="Medical education"
                />
              </div>
            </Carousel>
            <ListArticles />
          </section>
          <aside className="col-span-1 lg:col-span-2">
            <ListBulletins />
          </aside>
        </div>

        <PartnersCarousel />
        <AboutUs />
        <MissionVision />
        <ExpertTeam />
      </div>
    </div>
  )
}
