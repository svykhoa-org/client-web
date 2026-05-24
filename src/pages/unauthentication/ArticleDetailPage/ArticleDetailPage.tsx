import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Breadcrumb, Button, Card, Tag, Typography, message } from 'antd'
import dayjs from 'dayjs'

import { AsyncLoading } from '@/components/ui/AsyncLoading'
import { useAsyncState } from '@/hooks/useAsyncState'
import type { Article } from '@/models/Article'

const { Title, Paragraph, Text } = Typography

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(false)

  const articleState = useAsyncState<Article>()

  useEffect(() => {
    const loadArticleData = async () => {
      if (!slug) {
        message.error('Không tìm thấy bài viết')
        navigate('/')
        return
      }

      try {
        await articleState.execute(async () => {
          // Mock data for now - replace with actual service later
          const mockArticle: Article = {
            id: '1',
            title: 'Hướng dẫn chăm sóc sức khỏe tim mạch trong thời đại hiện đại',
            slug: slug,
            summary:
              'Tìm hiểu về các phương pháp chăm sóc và bảo vệ sức khỏe tim mạch hiệu quả, từ chế độ ăn uống đến tập luyện và kiểm tra sức khỏe định kỳ.',
            content: '',
            thumbnail:
              'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
            author: {
              id: '1',
              fullName: 'BS. Nguyễn Văn Minh',
              email: 'minh@hospital.com',
              avatarUrl:
                'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80',
              bio: 'Bác sĩ chuyên khoa Tim mạch',
              specialization: 'Tim mạch',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            category: {
              id: '1',
              name: 'Tim mạch',
              slug: 'tim-mach',
              description: 'Chuyên khoa tim mạch',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            viewCount: 15420,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          return mockArticle
        })
      } catch (error) {
        console.error('Error loading article:', error)
        message.error('Không thể tải bài viết')
      }
    }

    loadArticleData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, navigate])

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    message.success(isBookmarked ? 'Đã bỏ lưu bài viết' : 'Đã lưu bài viết')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    message.success('Đã sao chép liên kết bài viết')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <AsyncLoading loading={articleState.state.loading}>
          {articleState.state.data && (
            <>
              {/* Navigation */}
              <div className="mb-6">
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} className="mb-4">
                  Trở về trang chủ
                </Button>

                <Breadcrumb
                  items={[
                    { title: 'Trang chủ', href: '/' },
                    { title: 'Tin tức y khoa' },
                    { title: articleState.state.data.title },
                  ]}
                />
              </div>

              <div className="mx-auto max-w-4xl">
                {/* Article Header */}
                <Card className="mb-6">
                  <div className="mb-4">
                    <Tag color="blue" className="mb-3">
                      {articleState.state.data.category.name}
                    </Tag>

                    <Title level={1} className="mb-4">
                      {articleState.state.data.title}
                    </Title>

                    <Paragraph className="mb-6 text-lg text-gray-600">
                      {articleState.state.data.summary}
                    </Paragraph>
                  </div>

                  {/* Author and Meta Info */}
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        size={48}
                        src={articleState.state.data.author.avatarUrl}
                        icon={<UserOutlined />}
                      />
                      <div>
                        <Text strong className="block">
                          {articleState.state.data.author.fullName}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          {articleState.state.data.author.bio || 'Tác giả'}
                        </Text>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-gray-500">
                      <div className="flex items-center gap-1">
                        <CalendarOutlined />
                        <Text type="secondary">
                          {dayjs(articleState.state.data.createdAt).format('DD/MM/YYYY HH:mm')}
                        </Text>
                      </div>
                      <div className="flex items-center gap-1">
                        <EyeOutlined />
                        <Text type="secondary">
                          {articleState.state.data.viewCount.toLocaleString()} lượt xem
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button type={isBookmarked ? 'primary' : 'default'} onClick={handleBookmark}>
                      {isBookmarked ? 'Đã lưu' : 'Lưu bài viết'}
                    </Button>
                    <Button onClick={handleShare}>Chia sẻ</Button>
                  </div>
                </Card>

                {/* Featured Image */}
                <Card className="mb-6">
                  <img
                    src={articleState.state.data.thumbnail}
                    alt={articleState.state.data.title}
                    className="h-96 w-full rounded-lg object-cover"
                  />
                </Card>

                {/* Article Content */}
                <Card className="mb-6">
                  <div className="prose prose-lg max-w-none">
                    {/* Simulated realistic medical content */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `
                          <h2>Tổng quan về vấn đề</h2>
                          <p>Trong lĩnh vực y khoa hiện đại, việc hiểu rõ về các triệu chứng và phương pháp điều trị là vô cùng quan trọng. Bài viết này sẽ cung cấp những thông tin cập nhật và chính xác nhất về chủ đề được đề cập.</p>
                          
                          <p>Theo các nghiên cứu gần đây được công bố trên tạp chí Y học Việt Nam và các ấn phẩm quốc tế uy tín như The New England Journal of Medicine, chúng ta có thể thấy rõ sự phát triển vượt bậc trong việc chẩn đoán và điều trị.</p>

                          <h2>Nguyên nhân và cơ chế bệnh sinh</h2>
                          <p>Để hiểu rõ hơn về vấn đề này, chúng ta cần tìm hiểu về cơ chế bệnh sinh cơ bản. Các yếu tố nguy cơ chính bao gồm:</p>
                          
                          <ul>
                            <li><strong>Yếu tố di truyền:</strong> Các gen liên quan đến quá trình trao đổi chất và phản ứng miễn dịch</li>
                            <li><strong>Yếu tố môi trường:</strong> Ô nhiễm không khí, thực phẩm, và các chất độc hại khác</li>
                            <li><strong>Lối sống:</strong> Chế độ ăn uống, tập luyện, và thói quen sinh hoạt hàng ngày</li>
                            <li><strong>Tuổi tác:</strong> Sự lão hóa tự nhiên của cơ thể ảnh hưởng đến khả năng phục hồi</li>
                          </ul>

                          <h2>Triệu chứng và chẩn đoán</h2>
                          <p>Các triệu chứng thường gặp được chia thành các nhóm chính như sau:</p>
                          
                          <h3>Triệu chứng sớm</h3>
                          <p>Trong giai đoạn đầu, người bệnh thường xuất hiện các dấu hiệu không đặc hiệu như mệt mỏi, giảm cân không rõ nguyên nhân, và các rối loạn tiêu hóa nhẹ. Đây là thời điểm quan trọng nhất để can thiệp sớm và đạt hiệu quả điều trị tốt nhất.</p>

                          <h3>Triệu chứng tiến triển</h3>
                          <p>Khi bệnh tiến triển, các triệu chứng trở nên rõ ràng và đặc hiệu hơn. Bệnh nhân có thể xuất hiện đau đầu kéo dài, rối loạn giấc ngủ, và các biểu hiện thần kinh khác. Việc theo dõi sự thay đổi của các triệu chứng này giúp bác sĩ đánh giá mức độ nghiêm trọng và điều chỉnh phương án điều trị phù hợp.</p>

                          <h2>Phương pháp điều trị hiện đại</h2>
                          <p>Ngành y học hiện đại đã phát triển nhiều phương pháp điều trị tiên tiến và hiệu quả. Các liệu pháp được chia thành các nhóm chính:</p>

                          <h3>Điều trị nội khoa</h3>
                          <p>Sử dụng các loại thuốc chuyên biệt, được nghiên cứu và thử nghiệm lâm sàng kỹ lưỡng. Các thuốc mới thế hệ này có tác dụng nhanh hơn, ít tác dụng phụ hơn so với các thế hệ trước. Việc tuân thủ đúng liều lượng và thời gian điều trị là vô cùng quan trọng để đạt hiệu quả tối ưu.</p>

                          <h3>Điều trị ngoại khoa</h3>
                          <p>Với sự phát triển của kỹ thuật phẫu thuật nội soi và robot, các ca phẫu thuật ngày càng ít xâm lấn và có độ chính xác cao. Thời gian hồi phục được rút ngắn đáng kể, giúp bệnh nhân sớm trở lại cuộc sống bình thường.</p>

                          <h3>Liệu pháp kết hợp</h3>
                          <p>Xu hướng hiện tại là kết hợp nhiều phương pháp điều trị khác nhau để tối ưu hóa kết quả. Điều này bao gồm việc kết hợp y học cổ truyền với y học hiện đại, liệu pháp vật lý kết hợp với điều trị tâm lý.</p>

                          <h2>Vai trò của dinh dưỡng và lối sống</h2>
                          <p>Nghiên cứu cho thấy chế độ ăn uống và lối sống có ảnh hưởng rất lớn đến quá trình điều trị và phục hồi. Một chế độ dinh dưỡng cân bằng, giàu vitamin và khoáng chất sẽ hỗ trợ đắc lực cho quá trình điều trị.</p>

                          <p>Các thực phẩm được khuyến nghị bao gồm:</p>
                          <ul>
                            <li>Rau xanh đậm màu giàu folate và sắt</li>
                            <li>Cá béo chứa omega-3 tốt cho tim mạch và não bộ</li>
                            <li>Các loại hạt và đậu cung cấp protein thực vật</li>
                            <li>Trái cây tươi giàu vitamin C và chất chống oxi hóa</li>
                          </ul>

                          <h2>Tầm quan trọng của việc theo dõi định kỳ</h2>
                          <p>Việc khám sức khỏe định kỳ và theo dõi các chỉ số sinh học là vô cùng quan trọng. Điều này giúp phát hiện sớm các biến chứng có thể xảy ra và điều chỉnh phương án điều trị kịp thời.</p>

                          <p>Các xét nghiệm cần theo dõi định kỳ bao gồm:</p>
                          <ul>
                            <li>Xét nghiệm máu tổng quát và sinh hóa</li>
                            <li>Chẩn đoán hình ảnh như X-quang, CT, MRI</li>
                            <li>Các xét nghiệm chức năng cơ quan chuyên biệt</li>
                            <li>Đánh giá tâm lý và chất lượng cuộc sống</li>
                          </ul>

                          <h2>Kết luận và khuyến nghị</h2>
                          <p>Với sự phát triển không ngừng của khoa học y học, chúng ta có nhiều lý do để lạc quan về tương lai điều trị. Tuy nhiên, yếu tố quan trọng nhất vẫn là ý thức của người bệnh trong việc phát hiện sớm, điều trị đúng cách và tuân thủ các chỉ dẫn của bác sĩ.</p>

                          <p>Bài viết này chỉ mang tính chất tham khảo và không thể thay thế cho việc tư vấn trực tiếp từ các chuyên gia y tế. Độc giả nên tham khảo ý kiến bác sĩ chuyên khoa để có hướng điều trị phù hợp với tình trạng cụ thể của mình.</p>
                        `,
                      }}
                    />
                  </div>
                </Card>

                {/* Author Bio */}
                <Card title="Về tác giả" className="mb-6">
                  <div className="flex gap-4">
                    <Avatar
                      size={80}
                      src={articleState.state.data.author.avatarUrl}
                      icon={<UserOutlined />}
                    />
                    <div className="flex-1">
                      <Title level={4} className="mb-2">
                        {articleState.state.data.author.fullName}
                      </Title>
                      <Paragraph type="secondary" className="mb-3">
                        Bác sĩ chuyên khoa, có hơn 15 năm kinh nghiệm trong lĩnh vực y học lâm sàng.
                        Từng công tác tại các bệnh viện hàng đầu và tham gia nhiều nghiên cứu khoa
                        học được công bố trên các tạp chí y học uy tín trong và ngoài nước.
                      </Paragraph>
                      <div className="flex gap-2">
                        <Tag>Chuyên gia y học</Tag>
                        <Tag>Nghiên cứu viên</Tag>
                        <Tag>Tác giả</Tag>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Related Documents */}
                <Card title="Tài liệu tham khảo" className="mb-6">
                  <div className="space-y-3">
                    <div className="cursor-pointer rounded-md border p-3 hover:bg-gray-50">
                      <Title level={5} className="mb-1">
                        Hướng dẫn chẩn đoán và điều trị - Bộ Y tế 2024
                      </Title>
                      <Text type="secondary" className="text-sm">
                        Tài liệu chính thức từ Bộ Y tế về các phương pháp chẩn đoán và điều trị mới
                        nhất
                      </Text>
                      <div className="mt-2">
                        <Tag color="green">PDF</Tag>
                        <Tag color="blue">Miễn phí</Tag>
                      </div>
                    </div>

                    <div className="cursor-pointer rounded-md border p-3 hover:bg-gray-50">
                      <Title level={5} className="mb-1">
                        Nghiên cứu lâm sàng đa trung tâm 2023-2024
                      </Title>
                      <Text type="secondary" className="text-sm">
                        Kết quả nghiên cứu từ 12 bệnh viện lớn với hơn 5000 bệnh nhân tham gia
                      </Text>
                      <div className="mt-2">
                        <Tag color="green">PDF</Tag>
                        <Tag color="orange">Trả phí</Tag>
                      </div>
                    </div>

                    <div className="cursor-pointer rounded-md border p-3 hover:bg-gray-50">
                      <Title level={5} className="mb-1">
                        Video hướng dẫn kỹ thuật mới
                      </Title>
                      <Text type="secondary" className="text-sm">
                        Series video chi tiết về các kỹ thuật điều trị tiên tiến từ chuyên gia hàng
                        đầu
                      </Text>
                      <div className="mt-2">
                        <Tag color="red">Video</Tag>
                        <Tag color="blue">Miễn phí</Tag>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Social Share */}
                <Card title="Chia sẻ bài viết">
                  <div className="flex gap-3">
                    <Button type="primary" className="bg-blue-600">
                      Facebook
                    </Button>
                    <Button type="primary" className="bg-blue-400">
                      Twitter
                    </Button>
                    <Button type="primary" className="bg-blue-800">
                      LinkedIn
                    </Button>
                    <Button onClick={handleShare}>Sao chép liên kết</Button>
                  </div>
                </Card>
              </div>
            </>
          )}
        </AsyncLoading>
      </div>
    </div>
  )
}

export default ArticleDetailPage
