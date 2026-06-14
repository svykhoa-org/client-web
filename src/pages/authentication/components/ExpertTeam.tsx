import React from 'react'

import { Avatar } from 'antd'

const experts = [
  {
    id: 1,
    name: 'PGS.TS Nguyễn Văn An',
    position: 'Trưởng khoa Tim mạch',
    hospital: 'Bệnh viện Chợ Rẫy',
    specialization: 'Tim mạch can thiệp',
    experience: '20+ năm',
    avatar:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'TS.BS Trần Thị Bích',
    position: 'Phó Giám đốc Y khoa',
    hospital: 'Bệnh viện Bạch Mai',
    specialization: 'Nội tiết - Đái tháo đường',
    experience: '15+ năm',
    avatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'PGS.TS Lê Minh Cường',
    position: 'Trưởng khoa Ngoại thần kinh',
    hospital: 'Bệnh viện Việt Đức',
    specialization: 'Ngoại thần kinh',
    experience: '25+ năm',
    avatar:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'TS.BS Phạm Hoài Nam',
    position: 'Trưởng khoa Nhi',
    hospital: 'Bệnh viện Nhi Trung ương',
    specialization: 'Tim mạch nhi khoa',
    experience: '18+ năm',
    avatar:
      'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 5,
    name: 'TS.BS Võ Thị Mai',
    position: 'Phó Trưởng khoa Sản',
    hospital: 'Bệnh viện Từ Dũ',
    specialization: 'Sản phụ khoa',
    experience: '12+ năm',
    avatar:
      'https://images.unsplash.com/photo-1594824388531-2ad9b5d59cf9?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 6,
    name: 'PGS.TS Đặng Quốc Tuấn',
    position: 'Giám đốc Trung tâm',
    hospital: 'Trung tâm Ung bướu K',
    specialization: 'Ung thư học',
    experience: '22+ năm',
    avatar:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
  },
]

export const ExpertTeam: React.FC = () => {
  return (
    <section className="py-12">
      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold tracking-widest text-primary-6 uppercase">
          Chuyên gia
        </p>
        <h2 className="text-3xl font-bold text-gray-900">Đội ngũ chuyên gia</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
          Các chuyên gia y tế hàng đầu Việt Nam với nhiều năm kinh nghiệm trong từng lĩnh vực
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {experts.map(expert => (
          <div
            key={expert.id}
            className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:border-teal-200 hover:shadow-md"
          >
            <Avatar
              size={56}
              src={expert.avatar}
              className="flex-shrink-0"
              style={{ borderRadius: '12px' }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800">{expert.name}</p>
              <p className="truncate text-xs text-teal-600">{expert.position}</p>
              <p className="mt-0.5 truncate text-xs text-gray-400">{expert.hospital}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
                  {expert.specialization}
                </span>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs text-teal-600">
                  {expert.experience}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
