import { useEffect, useState } from 'react'

import { SearchOutlined, TeamOutlined } from '@ant-design/icons'
import { Col, Empty, Input, Row, Select, Spin, Typography } from 'antd'

import FeaturedUserCard from '@/components/user/FeaturedUserCard'
import type { User } from '@/models/User'
import { getFeaturedUsers } from '@/services/user'

const { Title, Paragraph } = Typography
const { Option } = Select

const FeaturedUsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<string>('rating')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await getFeaturedUsers()
        if (response.success) {
          setUsers(response.data)
        }
      } catch (error) {
        console.error('Error fetching featured users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Get unique specializations for filter dropdown
  const specializations = Array.from(
    new Set(users.map(user => user.specialization).filter(Boolean)),
  ) as string[]

  // Filter users based on search term and specialty filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm
      ? true
      : user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.bio?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.specialization?.toLowerCase() || '').includes(searchTerm.toLowerCase())

    const matchesSpecialty = !specialtyFilter ? true : user.specialization === specialtyFilter

    return matchesSearch && matchesSpecialty
  })

  // Sort users based on selected option
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOption === 'rating') {
      return (b.stats?.rating || 0) - (a.stats?.rating || 0)
    }
    if (sortOption === 'followers') {
      return (b.stats?.followerCount || 0) - (a.stats?.followerCount || 0)
    }
    if (sortOption === 'posts') {
      return (b.stats?.postCount || 0) - (a.stats?.postCount || 0)
    }
    return 0
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <Title level={2} className="text-green-700">
          <TeamOutlined className="mr-2" />
          Chuyên gia nổi bật
        </Title>
        <Paragraph className="mx-auto max-w-2xl text-gray-600">
          Kết nối với các bác sĩ, dược sĩ và chuyên gia y tế hàng đầu trong nhiều lĩnh vực. Họ là
          những người có kinh nghiệm lâu năm và đã được xác thực bởi hệ thống của chúng tôi.
        </Paragraph>
      </div>

      <div className="mb-8">
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={10} lg={12}>
            <Input
              placeholder="Tìm kiếm theo tên, chuyên khoa hoặc thông tin..."
              prefix={<SearchOutlined className="text-gray-400" />}
              allowClear
              onChange={e => setSearchTerm(e.target.value)}
              className="rounded-lg"
              size="large"
            />
          </Col>
          <Col xs={12} md={7} lg={6}>
            <Select
              placeholder="Chọn chuyên khoa"
              allowClear
              onChange={(value: string | null) => setSpecialtyFilter(value)}
              className="w-full"
              size="large"
            >
              {specializations.map(spec => (
                <Option key={spec} value={spec}>
                  {spec}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={7} lg={6}>
            <Select
              defaultValue="rating"
              onChange={(value: string) => setSortOption(value)}
              className="w-full"
              size="large"
            >
              <Option value="rating">Xếp hạng cao nhất</Option>
              <Option value="followers">Người theo dõi nhiều nhất</Option>
              <Option value="posts">Bài viết nhiều nhất</Option>
            </Select>
          </Col>
        </Row>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : sortedUsers.length === 0 ? (
          <Empty description="Không tìm thấy chuyên gia nào phù hợp" className="py-12" />
        ) : (
          <Row gutter={[24, 24]}>
            {sortedUsers.map(user => (
              <Col key={user.id} xs={24} sm={12} md={8} lg={8} xl={6} className="h-full">
                <FeaturedUserCard user={user} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  )
}

export default FeaturedUsersPage
