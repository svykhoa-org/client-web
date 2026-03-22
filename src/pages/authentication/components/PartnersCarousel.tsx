import React from 'react';

import { Carousel } from 'antd';

// Mock data cho các đối tác - bạn có thể thay thế bằng dữ liệu thực
const partners = [
  {
    id: 1,
    name: 'Bệnh viện Chợ Rẫy',
    logo: 'http://i.pinimg.com/1200x/69/c6/33/69c6338afc9ebc645d9c2b989f738e67.jpg',
    alt: 'Bệnh viện Chợ Rẫy',
  },
  {
    id: 2,
    name: 'Bệnh viện Bạch Mai',
    logo: 'https://i.pinimg.com/1200x/f5/64/d1/f564d158b6142dd54fdec75567f4bdce.jpg',
    alt: 'Bệnh viện Bạch Mai',
  },
  {
    id: 3,
    name: 'Đại học Y Dược TP.HCM',
    logo: 'http://i.pinimg.com/1200x/69/c6/33/69c6338afc9ebc645d9c2b989f738e67.jpg',
    alt: 'Đại học Y Dược TP.HCM',
  },
  {
    id: 4,
    name: 'Bệnh viện Đại học Y Hà Nội',
    logo: 'https://i.pinimg.com/1200x/f5/64/d1/f564d158b6142dd54fdec75567f4bdce.jpg',
    alt: 'Bệnh viện Đại học Y Hà Nội',
  },
  {
    id: 5,
    name: 'Pfizer Việt Nam',
    logo: 'http://i.pinimg.com/1200x/69/c6/33/69c6338afc9ebc645d9c2b989f738e67.jpg',
    alt: 'Pfizer Việt Nam',
  },
  {
    id: 6,
    name: 'Johnson & Johnson',
    logo: 'https://i.pinimg.com/1200x/f5/64/d1/f564d158b6142dd54fdec75567f4bdce.jpg',
    alt: 'Johnson & Johnson',
  },
  {
    id: 7,
    name: 'Abbott Việt Nam',
    logo: 'http://i.pinimg.com/1200x/69/c6/33/69c6338afc9ebc645d9c2b989f738e67.jpg',
    alt: 'Abbott Việt Nam',
  },
  {
    id: 8,
    name: 'Roche Việt Nam',
    logo: 'https://i.pinimg.com/1200x/f5/64/d1/f564d158b6142dd54fdec75567f4bdce.jpg',
    alt: 'Roche Việt Nam',
  },
];

export const PartnersCarousel: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h4 className="mb-3 text-xl font-semibold text-gray-800">Đối tác tin cậy</h4>
          <p className="mx-auto max-w-2xl text-sm text-gray-600">
            Chúng tôi hợp tác với các bệnh viện, trường đại học y khoa và công ty dược phẩm hàng đầu
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
            <div key={partner.id} className="px-2">
              <div className="text-center">
                <img
                  src={partner.logo}
                  alt={partner.alt}
                  style={{
                    height: '120px',
                    width: 'auto',
                    margin: '0 auto',
                    objectFit: 'contain',
                  }}
                />
                <p className="mt-3 text-sm font-medium text-gray-700">{partner.name}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};
