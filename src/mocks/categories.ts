import type { Category } from '@/models/Category'
import type { User } from '@/models/User'
import { UserRole, UserStatus } from '@/models/User'

export const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Tim mạch',
    description: 'Các bệnh lý về tim mạch, điều trị và phòng ngừa',
    slug: 'tim-mach',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat2',
    name: 'Nội tiết',
    description: 'Bệnh lý nội tiết, tiểu đường, tuyến giáp',
    slug: 'noi-tiet',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat3',
    name: 'Hô hấp',
    description: 'Các bệnh lý về đường hô hấp, phổi, phế quản',
    slug: 'ho-hap',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat4',
    name: 'Tiêu hóa',
    description: 'Bệnh lý về đường tiêu hóa, gan, mật, tụy',
    slug: 'tieu-hoa',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat5',
    name: 'Thần kinh',
    description: 'Các bệnh lý thần kinh, đột quỵ, động kinh',
    slug: 'than-kinh',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat6',
    name: 'Ung thư',
    description: 'Nghiên cứu và điều trị các bệnh ung thư',
    slug: 'ung-thu',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat7',
    name: 'Nhi khoa',
    description: 'Chăm sóc sức khỏe trẻ em và sơ sinh',
    slug: 'nhi-khoa',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat8',
    name: 'Sản phụ khoa',
    description: 'Sức khỏe phụ nữ, thai sản, và chăm sóc sản khoa',
    slug: 'san-phu-khoa',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat9',
    name: 'Da liễu',
    description: 'Các bệnh lý về da, tóc, móng',
    slug: 'da-lieu',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat10',
    name: 'Mắt',
    description: 'Các bệnh lý về mắt và thị lực',
    slug: 'mat',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat11',
    name: 'Tai mũi họng',
    description: 'Bệnh lý tai, mũi, họng và cổ',
    slug: 'tai-mui-hong',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat12',
    name: 'Cơ xương khớp',
    description: 'Các bệnh lý về xương, khớp, cơ và dây chằng',
    slug: 'co-xuong-khop',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat13',
    name: 'Thận - Tiết niệu',
    description: 'Các bệnh lý về thận và đường tiết niệu',
    slug: 'than-tiet-nieu',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat14',
    name: 'Y học cổ truyền',
    description: 'Đông y, châm cứu, và các phương pháp điều trị truyền thống',
    slug: 'y-hoc-co-truyen',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat15',
    name: 'Dược học',
    description: 'Nghiên cứu và phát triển thuốc, tương tác thuốc',
    slug: 'duoc-hoc',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat16',
    name: 'Y tế công cộng',
    description: 'Dịch tễ học, phòng chống dịch bệnh, chính sách y tế',
    slug: 'y-te-cong-cong',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat17',
    name: 'Công nghệ y sinh',
    description: 'Ứng dụng công nghệ trong y học, AI, telemedicine',
    slug: 'cong-nghe-y-sinh',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat18',
    name: 'Dinh dưỡng',
    description: 'Dinh dưỡng lâm sàng và dinh dưỡng cộng đồng',
    slug: 'dinh-duong',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat19',
    name: 'Tâm thần',
    description: 'Sức khỏe tâm thần, trầm cảm, lo âu',
    slug: 'tam-than',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat20',
    name: 'Chẩn đoán hình ảnh',
    description: 'X-quang, CT, MRI, siêu âm và các kỹ thuật chẩn đoán',
    slug: 'chan-doan-hinh-anh',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
]

export const mockFeaturedUsers: User[] = [
  {
    id: 'user1',
    fullName: 'PGS.TS Nguyễn Thanh Liêm',
    email: 'liem.nguyen@bvdaihoc.edu.vn',
    role: UserRole.Admin,
    status: UserStatus.Active,
    avatarUrl:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&crop=face',
    bio: 'Giám đốc Bệnh viện Đại học Y Dược TP.HCM, chuyên khoa Tim mạch',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-06-28T00:00:00.000Z',
  },
  {
    id: 'user2',
    fullName: 'TS.BS Trần Thị Minh Phương',
    email: 'phuong.tran@vn.who.int',
    role: UserRole.Mod,
    status: UserStatus.Active,
    avatarUrl:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face',
    bio: 'Chuyên gia WHO Việt Nam, Tiến sĩ Y tế công cộng',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-06-27T00:00:00.000Z',
  },
  {
    id: 'user3',
    fullName: 'BS.CKII Lê Văn Quốc',
    email: 'quoc.le@108.vn',
    role: UserRole.User,
    status: UserStatus.Active,
    avatarUrl:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face',
    bio: 'Trưởng khoa Cấp cứu - Bệnh viện Trung ương Quân đội 108',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-06-26T00:00:00.000Z',
  },
  {
    id: 'user4',
    fullName: 'TS.DS Phạm Thị Bích Dao',
    email: 'dao.pham@hmu.edu.vn',
    role: UserRole.User,
    status: UserStatus.Active,
    avatarUrl:
      'https://images.unsplash.com/photo-1594824694996-f635debc4464?w=80&h=80&fit=crop&crop=face',
    bio: 'Phó Hiệu trưởng Đại học Y Hà Nội, chuyên khoa Dược học',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-06-25T00:00:00.000Z',
  },
  {
    id: 'user5',
    fullName: 'BS.CKI Nguyễn Đức Công',
    email: 'cong.nguyen@vinmec.com',
    role: UserRole.User,
    status: UserStatus.Active,
    avatarUrl:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80&h=80&fit=crop&crop=face',
    bio: 'Bác sĩ chuyên khoa I Nhi khoa - Hệ thống Y tế Vinmec',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-06-24T00:00:00.000Z',
  },
]

// Mock documents/resources
export interface FeaturedDocument {
  id: string
  title: string
  description: string
  downloadUrl: string
  viewCount: number
  category: string
  fileType: 'PDF' | 'DOC' | 'PPT'
  createdAt: string
}

export const mockFeaturedDocuments: FeaturedDocument[] = [
  {
    id: 'doc1',
    title: 'Hướng dẫn điều trị COVID-19 phiên bản 8.0',
    description: 'Hướng dẫn chẩn đoán và điều trị COVID-19 mới nhất từ Bộ Y tế',
    downloadUrl: '/documents/covid-19-treatment-guide-v8.pdf',
    viewCount: 15420,
    category: 'Hướng dẫn điều trị',
    fileType: 'PDF',
    createdAt: '2025-06-15T00:00:00.000Z',
  },
  {
    id: 'doc2',
    title: 'Danh mục thuốc thiết yếu Việt Nam 2025',
    description: 'Danh mục thuốc thiết yếu được cập nhật theo Thông tư 19/2025',
    downloadUrl: '/documents/essential-medicines-list-2025.pdf',
    viewCount: 8930,
    category: 'Dược phẩm',
    fileType: 'PDF',
    createdAt: '2025-06-10T00:00:00.000Z',
  },
  {
    id: 'doc3',
    title: 'Quy trình khám sàng lọc ung thư',
    description: 'Quy trình khám sàng lọc ung thư phổi, vú, cổ tử cung',
    downloadUrl: '/documents/cancer-screening-protocol.pdf',
    viewCount: 6750,
    category: 'Quy trình',
    fileType: 'PDF',
    createdAt: '2025-06-05T00:00:00.000Z',
  },
  {
    id: 'doc4',
    title: 'Tiêu chuẩn An toàn thực phẩm 2025',
    description: 'Tiêu chuẩn mới về an toàn thực phẩm và vệ sinh môi trường',
    downloadUrl: '/documents/food-safety-standards-2025.pdf',
    viewCount: 4320,
    category: 'An toàn thực phẩm',
    fileType: 'PDF',
    createdAt: '2025-05-28T00:00:00.000Z',
  },
  {
    id: 'doc5',
    title: 'Bài giảng Dược lý học cơ bản',
    description: 'Tài liệu bài giảng dành cho sinh viên Y Dược',
    downloadUrl: '/documents/basic-pharmacology-lectures.ppt',
    viewCount: 12650,
    category: 'Giáo dục',
    fileType: 'PPT',
    createdAt: '2025-05-20T00:00:00.000Z',
  },
]
