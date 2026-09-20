// import { Carousel } from 'antd' // tạm ẩn cùng banner carousel bên dưới (giữ để bật lại)

import { AboutUs, ExpertTeam, MissionVision, PartnersCarousel } from '../components'
import HomeHero from './components/HomeHero'
import { ListArticles } from './components/ListArticles'
import { ListBulletins } from './components/ListBulletins'

export const HomePage = () => {
  return (
    <div>
      <HomeHero />

      {/* Gap rõ ràng giữa hero và nội dung (bỏ overlap -mt cũ theo góp ý: cần gap lớn hơn) */}
      <div className="relative z-10 container mx-auto px-4 pt-12 pb-8">
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

        <PartnersCarousel />
        <AboutUs />
        <MissionVision />
        <ExpertTeam />
      </div>
    </div>
  )
}
