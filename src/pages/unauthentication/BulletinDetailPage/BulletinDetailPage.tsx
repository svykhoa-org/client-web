import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import {
  ArrowLeftOutlined,
  CalendarOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  NotificationOutlined,
} from '@ant-design/icons'
import { Alert, Avatar, Breadcrumb, Button, Card, Tag, Typography, message } from 'antd'
import dayjs from 'dayjs'

import { AsyncLoading } from '@/components/ui/AsyncLoading'
import { useAsyncState } from '@/hooks/useAsyncState'
import type { Attachment } from '@/models/Attachment'
import type { Bulletin } from '@/models/Bulletin'

const { Title, Text } = Typography

const BulletinDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(false)

  const bulletinState = useAsyncState<Bulletin>()

  useEffect(() => {
    const loadBulletinData = async () => {
      if (!slug) {
        message.error('Không tìm thấy thông báo')
        navigate('/')
        return
      }

      try {
        await bulletinState.execute(async () => {
          // Mock data for now - replace with actual service later
          const mockBulletin: Bulletin = {
            id: '1',
            title: 'Thông báo triển khai Hệ thống Quản lý Bệnh án Điện tử mới',
            slug: slug,
            content: `
            <h2>Thông báo về việc triển khai Hệ thống Quản lý Bệnh án Điện tử</h2>
            <p><strong>Kính gửi:</strong> Toàn thể cán bộ y tế, bác sĩ, điều dưỡng và nhân viên y tế</p>
            
            <h3>1. Mục đích triển khai</h3>
            <p>Nhằm nâng cao chất lượng dịch vụ khám chữa bệnh, tăng cường hiệu quả quản lý và đáp ứng yêu cầu chuyển đổi số trong ngành y tế, Bộ Y tế quyết định triển khai Hệ thống Quản lý Bệnh án Điện tử (EMR) trên toàn quốc.</p>

            <h3>2. Phạm vi áp dụng</h3>
            <ul>
              <li>Tất cả các bệnh viện công lập từ tuyến trung ương đến tuyến huyện</li>
              <li>Các cơ sở y tế tư nhân có từ 50 giường bệnh trở lên</li>
              <li>Các trung tâm y tế dự phòng tỉnh/thành phố</li>
              <li>Các trạm y tế xã/phường/thị trấn có điều kiện kỹ thuật</li>
            </ul>

            <h3>3. Thời gian triển khai</h3>
            <p><strong>Giai đoạn 1 (01/01/2025 - 31/03/2025):</strong></p>
            <ul>
              <li>Triển khai tại các bệnh viện tuyến trung ương</li>
              <li>Đào tạo đội ngũ quản trị hệ thống</li>
              <li>Xây dựng quy trình vận hành chuẩn</li>
            </ul>

            <p><strong>Giai đoạn 2 (01/04/2025 - 30/06/2025):</strong></p>
            <ul>
              <li>Mở rộng đến các bệnh viện tuyến tỉnh</li>
              <li>Đào tạo cán bộ y tế sử dụng hệ thống</li>
              <li>Kiểm tra, đánh giá hiệu quả ban đầu</li>
            </ul>

            <p><strong>Giai đoạn 3 (01/07/2025 - 31/12/2025):</strong></p>
            <ul>
              <li>Triển khai toàn diện đến tuyến huyện và xã</li>
              <li>Hoàn thiện hệ thống kết nối liên thông</li>
              <li>Đánh giá tổng thể và rút kinh nghiệm</li>
            </ul>

            <h3>4. Lợi ích của hệ thống</h3>
            <h4>Đối với bệnh nhân:</h4>
            <ul>
              <li>Tiết kiệm thời gian khám chữa bệnh</li>
              <li>Giảm chi phí in ấn, photo tài liệu</li>
              <li>Dễ dàng tra cứu lịch sử khám bệnh</li>
              <li>Bảo mật thông tin y tế cá nhân</li>
            </ul>

            <h4>Đối với cán bộ y tế:</h4>
            <ul>
              <li>Quản lý bệnh án hiệu quả và chính xác</li>
              <li>Tra cứu thông tin bệnh nhân nhanh chóng</li>
              <li>Giảm tải công việc giấy tờ</li>
              <li>Hỗ trợ ra quyết định lâm sàng</li>
            </ul>

            <h4>Đối với cơ sở y tế:</h4>
            <ul>
              <li>Nâng cao năng lực quản lý</li>
              <li>Tối ưu hóa quy trình vận hành</li>
              <li>Cải thiện chất lượng dịch vụ</li>
              <li>Tuân thủ quy định pháp luật</li>
            </ul>

            <h3>5. Yêu cầu chuẩn bị</h3>
            <h4>Về cơ sở hạ tầng:</h4>
            <ul>
              <li>Hệ thống mạng Internet tốc độ cao, ổn định</li>
              <li>Máy tính, thiết bị đầu cuối đáp ứng cấu hình tối thiểu</li>
              <li>Hệ thống lưu trữ dữ liệu an toàn</li>
              <li>Nguồn điện dự phòng liên tục</li>
            </ul>

            <h4>Về nhân lực:</h4>
            <ul>
              <li>Bổ nhiệm Ban chỉ đạo triển khai tại mỗi cơ sở</li>
              <li>Đào tạo đội ngũ quản trị hệ thống</li>
              <li>Tập huấn cho toàn bộ cán bộ y tế</li>
              <li>Thiết lập đội ngũ hỗ trợ kỹ thuật</li>
            </ul>

            <h3>6. Tài liệu hướng dẫn</h3>
            <p>Bộ Y tế sẽ cung cấp đầy đủ tài liệu hướng dẫn bao gồm:</p>
            <ul>
              <li>Sổ tay sử dụng hệ thống cho từng đối tượng</li>
              <li>Video hướng dẫn chi tiết các chức năng</li>
              <li>Quy trình vận hành chuẩn (SOP)</li>
              <li>Câu hỏi thường gặp (FAQ)</li>
            </ul>

            <h3>7. Hỗ trợ kỹ thuật</h3>
            <p>Trong quá trình triển khai, các cơ sở y tế sẽ được hỗ trợ:</p>
            <ul>
              <li>Đường dây nóng hỗ trợ 24/7: <strong>1900-xxxx</strong></li>
              <li>Email hỗ trợ: <strong>emr-support@moh.gov.vn</strong></li>
              <li>Đội ngũ kỹ thuật trực tiếp tại hiện trường</li>
              <li>Cổng thông tin hỗ trợ trực tuyến</li>
            </ul>

            <h3>8. Yêu cầu bảo mật</h3>
            <p>Việc triển khai phải đảm bảo:</p>
            <ul>
              <li>Tuân thủ Luật An toàn thông tin mạng</li>
              <li>Bảo vệ thông tin cá nhân theo GDPR</li>
              <li>Mã hóa dữ liệu end-to-end</li>
              <li>Kiểm soát truy cập đa lớp</li>
              <li>Sao lưu dữ liệu định kỳ</li>
            </ul>

            <h3>9. Trách nhiệm triển khai</h3>
            <h4>Bộ Y tế:</h4>
            <ul>
              <li>Chỉ đạo chung, ban hành văn bản hướng dẫn</li>
              <li>Cung cấp phần mềm và hỗ trợ kỹ thuật</li>
              <li>Giám sát, đánh giá tiến độ triển khai</li>
            </ul>

            <h4>Sở Y tế tỉnh/thành:</h4>
            <ul>
              <li>Triển khai tại các cơ sở trực thuộc</li>
              <li>Đào tạo, tập huấn cán bộ</li>
              <li>Báo cáo tiến độ định kỳ</li>
            </ul>

            <h4>Các cơ sở y tế:</h4>
            <ul>
              <li>Chuẩn bị cơ sở hạ tầng</li>
              <li>Tổ chức đào tạo nội bộ</li>
              <li>Vận hành thử nghiệm trước khi chính thức</li>
            </ul>

            <h3>10. Chế tài xử lý</h3>
            <p>Các cơ sở không tuân thủ tiến độ triển khai sẽ bị:</p>
            <ul>
              <li>Nhắc nhở, yêu cầu báo cáo giải trình</li>
              <li>Tạm dừng các dự án đầu tư mới</li>
              <li>Xem xét trách nhiệm người đứng đầu</li>
              <li>Ảnh hưởng đến đánh giá hiệu quả hoạt động</li>
            </ul>

            <p><strong>Lưu ý quan trọng:</strong> Đây là yêu cầu bắt buộc nhằm hiện đại hóa ngành y tế Việt Nam. Mọi cơ sở y tế cần tích cực phối hợp để đảm bảo triển khai thành công.</p>

            <p>Thông báo này có hiệu lực từ ngày ký và thay thế các thông báo trước đó có nội dung trái ngược.</p>

            <p style="text-align: right; margin-top: 40px;">
              <strong>Hà Nội, ngày 15 tháng 8 năm 2025</strong><br>
              <strong>THỦ TRƯỞNG CƠ QUAN</strong><br><br><br>
              <strong>Nguyễn Thanh Hà</strong><br>
              <em>Thứ trưởng Bộ Y tế</em>
            </p>
          `,
            thumbnail:
              'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80',
            attachment: [
              {
                id: 'att1',
                postId: '1',
                uploadedBy: 'system',
                metadata: {
                  fileName: 'Quy_trinh_EMR_2025.pdf',
                  fileType: 'application/pdf',
                  fileSize: 2.5,
                  url: '/documents/emr-process-2025.pdf',
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 'att2',
                postId: '1',
                uploadedBy: 'system',
                metadata: {
                  fileName: 'Huong_dan_su_dung_EMR.docx',
                  fileType:
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  fileSize: 1.8,
                  url: '/documents/emr-user-guide.docx',
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 'att3',
                postId: '1',
                uploadedBy: 'system',
                metadata: {
                  fileName: 'Video_demo_EMR_system.mp4',
                  fileType: 'video/mp4',
                  fileSize: 45.2,
                  url: '/videos/emr-demo.mp4',
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          return mockBulletin
        })
      } catch (error) {
        console.error('Error loading bulletin:', error)
        message.error('Không thể tải thông báo')
      }
    }

    loadBulletinData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, navigate])
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    message.success(isBookmarked ? 'Đã bỏ lưu thông báo' : 'Đã lưu thông báo')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    message.success('Đã sao chép liên kết thông báo')
  }

  const handleDownload = (attachment: Attachment) => {
    message.success(`Đang tải xuống: ${attachment.metadata.fileName}`)
    // Implement actual download logic here
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('doc')) return '📝'
    if (type.includes('video')) return '🎥'
    if (type.includes('image')) return '🖼️'
    return '📁'
  }

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) return `${(sizeInMB * 1024).toFixed(0)} KB`
    return `${sizeInMB.toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <AsyncLoading loading={bulletinState.state.loading}>
          {bulletinState.state.data && (
            <>
              {/* Navigation */}
              <div className="mb-6">
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} className="mb-4">
                  Trở về trang chủ
                </Button>

                <Breadcrumb
                  items={[
                    { title: 'Trang chủ', href: '/' },
                    { title: 'Thông báo' },
                    { title: bulletinState.state.data.title },
                  ]}
                />
              </div>

              <div className="mx-auto max-w-4xl">
                {/* Bulletin Header */}
                <Card className="mb-6">
                  <div className="mb-4">
                    <div className="mb-3 flex items-center gap-2">
                      <NotificationOutlined className="text-red-500" />
                      <Tag color="red" className="text-sm font-medium">
                        THÔNG BÁO QUAN TRỌNG
                      </Tag>
                    </div>

                    <Title level={1} className="mb-4 text-red-600">
                      {bulletinState.state.data.title}
                    </Title>

                    <Alert
                      message="Đây là thông báo chính thức từ Bộ Y tế"
                      description="Tất cả các cơ sở y tế cần tuân thủ nghiêm ngặt các quy định trong thông báo này."
                      type="warning"
                      showIcon
                      className="mb-6"
                    />
                  </div>

                  {/* Meta Info */}
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar size={48} className="bg-red-500">
                        <NotificationOutlined />
                      </Avatar>
                      <div>
                        <Text strong className="block">
                          Bộ Y tế Việt Nam
                        </Text>
                        <Text type="secondary" className="text-sm">
                          Cơ quan ban hành
                        </Text>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-gray-500">
                      <div className="flex items-center gap-1">
                        <CalendarOutlined />
                        <Text type="secondary">
                          {dayjs(bulletinState.state.data.createdAt).format('DD/MM/YYYY HH:mm')}
                        </Text>
                      </div>
                      <div className="flex items-center gap-1">
                        <EyeOutlined />
                        <Text type="secondary">
                          {Math.floor(Math.random() * 10000 + 5000).toLocaleString()} lượt xem
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button type={isBookmarked ? 'primary' : 'default'} onClick={handleBookmark}>
                      {isBookmarked ? 'Đã lưu' : 'Lưu thông báo'}
                    </Button>
                    <Button onClick={handleShare}>Chia sẻ</Button>
                  </div>
                </Card>

                {/* Featured Image */}
                <Card className="mb-6">
                  <img
                    src={bulletinState.state.data.thumbnail}
                    alt={bulletinState.state.data.title}
                    className="h-96 w-full rounded-lg object-cover"
                  />
                </Card>

                {/* Bulletin Content */}
                <Card className="mb-6">
                  <div className="prose prose-lg max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: bulletinState.state.data.content,
                      }}
                    />
                  </div>
                </Card>

                {/* Attachments */}
                {bulletinState.state.data.attachment &&
                  bulletinState.state.data.attachment.length > 0 && (
                    <Card title="Tài liệu đính kèm" className="mb-6">
                      <div className="space-y-4">
                        {bulletinState.state.data.attachment.map(file => (
                          <div
                            key={file.id}
                            className="cursor-pointer rounded-md border p-4 transition-colors hover:bg-gray-50"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                  {getFileIcon(file.metadata.fileType)}
                                </span>
                                <div>
                                  <Title level={5} className="mb-1">
                                    {file.metadata.fileName}
                                  </Title>
                                  <Text type="secondary" className="text-sm">
                                    {formatFileSize(file.metadata.fileSize)} •{' '}
                                    {file.metadata.fileType.split('/')[1]?.toUpperCase()}
                                  </Text>
                                </div>
                              </div>
                              <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() => handleDownload(file)}
                              >
                                Tải xuống
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                {/* Important Notice */}
                <Card className="mb-6">
                  <Alert
                    message="Lưu ý quan trọng"
                    description={
                      <div className="space-y-2">
                        <p>• Thông báo này có tính chất bắt buộc đối với tất cả các cơ sở y tế</p>
                        <p>• Các đơn vị cần báo cáo tiến độ thực hiện theo định kỳ</p>
                        <p>
                          • Mọi thắc mắc vui lòng liên hệ hotline: <strong>1900-xxxx</strong>
                        </p>
                        <p>
                          • Email hỗ trợ: <strong>emr-support@moh.gov.vn</strong>
                        </p>
                      </div>
                    }
                    type="info"
                    showIcon
                  />
                </Card>

                {/* Related Documents */}
                <Card title="Văn bản liên quan" className="mb-6">
                  <div className="space-y-3">
                    <div className="cursor-pointer rounded-md border p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileTextOutlined className="text-blue-500" />
                        <div>
                          <Title level={5} className="mb-1">
                            Thông tư 01/2025/TT-BYT về quy định quản lý bệnh án điện tử
                          </Title>
                          <Text type="secondary" className="text-sm">
                            Ban hành ngày 01/01/2025
                          </Text>
                        </div>
                      </div>
                    </div>

                    <div className="cursor-pointer rounded-md border p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileTextOutlined className="text-blue-500" />
                        <div>
                          <Title level={5} className="mb-1">
                            Quyết định 123/QĐ-BYT về phê duyệt dự án EMR quốc gia
                          </Title>
                          <Text type="secondary" className="text-sm">
                            Ban hành ngày 15/12/2024
                          </Text>
                        </div>
                      </div>
                    </div>

                    <div className="cursor-pointer rounded-md border p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileTextOutlined className="text-blue-500" />
                        <div>
                          <Title level={5} className="mb-1">
                            Hướng dẫn kỹ thuật triển khai hệ thống EMR
                          </Title>
                          <Text type="secondary" className="text-sm">
                            Cập nhật ngày 10/08/2025
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Contact Information */}
                <Card title="Thông tin liên hệ">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <Title level={5}>Đường dây nóng</Title>
                      <Text className="block text-lg font-semibold text-blue-600">1900-xxxx</Text>
                      <Text type="secondary">Hỗ trợ 24/7</Text>
                    </div>

                    <div>
                      <Title level={5}>Email hỗ trợ</Title>
                      <Text className="block text-lg font-semibold text-blue-600">
                        emr-support@moh.gov.vn
                      </Text>
                      <Text type="secondary">Phản hồi trong 2 giờ</Text>
                    </div>

                    <div>
                      <Title level={5}>Địa chỉ</Title>
                      <Text>138A Giảng Võ, Ba Đình, Hà Nội</Text>
                    </div>

                    <div>
                      <Title level={5}>Website</Title>
                      <Text className="block text-blue-600">https://moh.gov.vn</Text>
                    </div>
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

export default BulletinDetailPage
