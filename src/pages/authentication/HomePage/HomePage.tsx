import { useNavigate } from 'react-router';

import { Carousel, Typography } from 'antd';

import SearchBar from '@/components/common/Header/src/SearchBar';
import RouteConfig from '@/constants/RouteConfig';

import { AboutUs, ExpertTeam, MissionVision, PartnersCarousel } from '../components';
// import { HotCoursesList } from './components';
import { ListArticles } from './components/ListArticles';
import { ListBulletins } from './components/ListBulletins';

const { Title, Text } = Typography;

export const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    navigate(RouteConfig.MedicalSearchPage.path, { state: { searchQuery: value } });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section with Enhanced Search */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Title level={2} className="mb-6 text-5xl font-bold text-gray-800">
              Tìm kiếm thông tin y khoa
            </Title>
            <Text className="mb-10 text-xl text-gray-600">
              Tra cứu triệu chứng, bệnh lý, thuốc và tài liệu y khoa với AI hỗ trợ chuyên nghiệp
            </Text>
            <div className="mt-4 flex justify-center">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-8 gap-6">
          <section className="col-span-6">
            <Carousel autoplay className="pb-6">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                  className="h-60 w-full object-cover"
                  alt="Medical 1"
                />
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1519494080410-f9aa8cfbfc02?auto=format&fit=crop&w=600&q=80"
                  className="h-60 w-full object-cover"
                  alt="Medical 2"
                />
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
                  className="h-60 w-full object-cover"
                  alt="Medical 3"
                />
              </div>
            </Carousel>
            <ListArticles />
          </section>
          <aside className="col-span-2 space-y-6">
            {/* <PopularSearches /> */}
            <ListBulletins />
          </aside>
        </div>

        {/* Hot Courses Section */}
        <div className="mt-4 w-full">{/* <HotCoursesList /> */}</div>

        {/* Partners Carousel - đặt giữa content và HotCourse */}
        <PartnersCarousel />

        {/* About Us Section */}
        <AboutUs />

        {/* Mission & Vision Section */}
        <MissionVision />

        {/* Expert Team Section */}
        <ExpertTeam />
      </div>
    </div>
  );
};
