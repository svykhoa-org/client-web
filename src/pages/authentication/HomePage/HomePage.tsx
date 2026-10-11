// import { Carousel } from 'antd' // tạm ẩn cùng banner carousel bên dưới (giữ để bật lại)
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { AboutUs, ExpertTeam, PartnersCarousel } from '../components'
import HomeHero from './components/HomeHero'
import { ListArticles } from './components/ListArticles'
import { ListBulletins } from './components/ListBulletins'

// Full-bleed section band. Bands alternate page-grey / white so consecutive
// sections read as distinct blocks; each band owns its vertical padding so the
// gap between sections stays uniform. The 100vw + negative margin trick
// escapes MainLayout's centered container (same technique as HomeHero).
const HomeBand = ({
  tone,
  className,
  children,
}: {
  tone: 'page' | 'white'
  className?: string
  children: ReactNode
}) => (
  <section
    className={cn(tone === 'white' ? 'bg-white' : 'bg-page', 'py-16 lg:py-20', className)}
    style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}
  >
    <div className="container mx-auto px-4">{children}</div>
  </section>
)

export const HomePage = () => {
  return (
    <div>
      <HomeHero />

      <HomeBand tone="page">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-8">
          <section className="col-span-1 lg:col-span-6">
            {/* Banner carousel tạm ẩn theo góp ý (để "Tin nổi bật" ngang hàng "Thông báo").
                Giữ code để bật lại sau khi cần.
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
            */}
            <ListArticles />
          </section>
          <aside className="col-span-1 lg:col-span-2">
            <ListBulletins />
          </aside>
        </div>
      </HomeBand>

      {/* White band: several partner logos ship on a white canvas */}
      <HomeBand tone="white">
        <PartnersCarousel />
      </HomeBand>

      <HomeBand tone="page">
        <AboutUs />
      </HomeBand>

      {/* -mb-4 cancels MainLayout's py-4 so the last band meets the footer */}
      <HomeBand tone="white" className="-mb-4">
        <ExpertTeam />
      </HomeBand>
    </div>
  )
}
