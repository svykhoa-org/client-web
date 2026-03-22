import type { Category } from '@/models/Category';
import { type Resource, ResourceStatus } from '@/models/Resource';
import type { User } from '@/models/User';
import { UserRole, UserStatus } from '@/models/User';

// Mock users for resource uploaders
const mockUploaders: User[] = [
  {
    _id: 'uploader1',
    id: 'uploader1',
    fullName: 'PGS. TS. Nguyễn Minh Hà',
    email: 'ha.nguyen@benhvien103.vn',
    role: UserRole.Admin,
    status: UserStatus.Active,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=60&h=60&fit=crop&crop=face',
    bio: 'Giảng viên ĐH Y Hà Nội, Chuyên khoa Nội',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2025-04-20T00:00:00.000Z',
  },
  {
    _id: 'uploader2',
    id: 'uploader2',
    fullName: 'TS. BS. Trần Văn Lộc',
    email: 'loc.tran@yduocHCM.edu.vn',
    role: UserRole.User,
    status: UserStatus.Active,
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&crop=face',
    bio: 'Trưởng khoa Dược lâm sàng - ĐH Y Dược TP.HCM',
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2025-05-15T00:00:00.000Z',
  },
  {
    _id: 'uploader3',
    id: 'uploader3',
    fullName: 'ThS. DS. Lê Thị Thanh Hà',
    email: 'ha.le@phongkhamdakhoa.vn',
    role: UserRole.Mod,
    status: UserStatus.Active,
    avatarUrl: 'https://images.unsplash.com/photo-1594824694996-f635debc4464?w=60&h=60&fit=crop&crop=face',
    bio: 'Trưởng phòng nghiên cứu - Viện Y học ứng dụng',
    createdAt: '2024-03-05T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z',
  },
];

// Mock categories for resources
const mockResourceCategories: Category[] = [
  {
    _id: 'cat1',
    id: 'cat1',
    name: 'Tài liệu giảng dạy',
    description: 'Giáo trình, bài giảng dành cho sinh viên y khoa',
    slug: 'tai-lieu-giang-day',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: 'cat2',
    id: 'cat2',
    name: 'Nghiên cứu khoa học',
    description: 'Các báo cáo nghiên cứu, luận án, đề tài khoa học',
    slug: 'nghien-cuu-khoa-hoc',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: 'cat3',
    id: 'cat3',
    name: 'Hướng dẫn điều trị',
    description: 'Các hướng dẫn, quy trình điều trị từ Bộ Y tế và các tổ chức y tế',
    slug: 'huong-dan-dieu-tri',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: 'cat4',
    id: 'cat4',
    name: 'Dược phẩm',
    description: 'Thông tin về thuốc, YHCT và các chế phẩm y dược',
    slug: 'duoc-pham',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: 'cat5',
    id: 'cat5',
    name: 'Y học thực hành',
    description: 'Tài liệu thực hành lâm sàng, case studies, hướng dẫn thủ thuật',
    slug: 'y-hoc-thuc-hanh',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

// Mock resources
export const mockResources: Resource[] = [
  {
    _id: 'resource1',
    id: 'resource1',
    title: 'Cẩm nang Điều trị COVID-19 tại nhà (Phiên bản 2025)',
    fileUrl: 'https://res.cloudinary.com/medical-forum-vn/documents/covid19_home_treatment_guide_2025.pdf',
    description:
      'Hướng dẫn chi tiết về phác đồ điều trị, theo dõi và chăm sóc bệnh nhân COVID-19 mức độ nhẹ và trung bình tại nhà. Cập nhật với các biến thể mới nhất và phác đồ điều trị 2025.',
    uploaderId: 'uploader1',
    categoryId: 'cat3',
    price: 0, // Free
    currency: 'VND',
    status: ResourceStatus.APPROVED,
    downloadCount: 15240,
    fileSize: 3500000, // 3.5MB
    fileType: 'PDF',
    thumbnail: 'https://images.unsplash.com/photo-1584483766114-2cea6fac257d?w=500&h=300&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1584483766114-2cea6fac257d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584036561566-b93a58161f8c?w=800&h=600&fit=crop',
    ],
    tags: ['COIVD-19', 'Điều trị tại nhà', 'Y tế cộng đồng'],
    avgRating: 4.8,
    totalReviews: 124,
    soldCount: 0,
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-05-20T00:00:00.000Z',
    // Relationships
    uploader: mockUploaders[0],
    category: mockResourceCategories[2],
  },
  {
    _id: 'resource2',
    id: 'resource2',
    title: 'Atlas Giải phẫu Người - Phiên bản tương tác',
    fileUrl: 'https://res.cloudinary.com/medical-forum-vn/documents/interactive_human_anatomy_atlas.pptx',
    description:
      'Tài liệu giảng dạy giải phẫu người với hình ảnh 3D tương tác chất lượng cao, có thể sử dụng trong giảng dạy trực tiếp hoặc học từ xa cho sinh viên Y khoa năm thứ nhất và thứ hai.',
    uploaderId: 'uploader2',
    categoryId: 'cat1',
    price: 350000,
    currency: 'VND',
    status: ResourceStatus.APPROVED,
    downloadCount: 8756,
    fileSize: 125000000, // 125MB
    fileType: 'PPTX',
    thumbnail: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=500&h=300&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=600&fit=crop',
    ],
    tags: ['Giải phẫu', 'Atlas 3D', 'Sinh viên Y'],
    avgRating: 4.9,
    totalReviews: 89,
    soldCount: 450,
    createdAt: '2025-02-10T00:00:00.000Z',
    updatedAt: '2025-04-15T00:00:00.000Z',
    // Relationships
    uploader: mockUploaders[1],
    category: mockResourceCategories[0],
  },
  {
    _id: 'resource3',
    id: 'resource3',
    title: 'Danh mục thuốc thiết yếu Việt Nam 2025',
    fileUrl: 'https://res.cloudinary.com/medical-forum-vn/documents/vietnam_essential_medicines_list_2025.pdf',
    description:
      'Danh mục thuốc thiết yếu được Bộ Y tế ban hành theo Thông tư 15/2025/TT-BYT, bao gồm danh sách các thuốc thiết yếu, thuốc chủ yếu sử dụng tại tuyến y tế cơ sở và hướng dẫn sử dụng.',
    uploaderId: 'uploader3',
    categoryId: 'cat4',
    price: 0, // Free
    currency: 'VND',
    status: ResourceStatus.APPROVED,
    downloadCount: 12450,
    fileSize: 4200000, // 4.2MB
    fileType: 'PDF',
    thumbnail: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop'],
    tags: ['Thuốc thiết yếu', 'Dược phẩm', 'Bộ Y tế'],
    avgRating: 4.5,
    totalReviews: 45,
    soldCount: 0,
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2025-03-01T00:00:00.000Z',
    // Relationships
    uploader: mockUploaders[2],
    category: mockResourceCategories[3],
  },
  {
    _id: 'resource4',
    id: 'resource4',
    title: 'Hướng dẫn chẩn đoán và điều trị sốt xuất huyết Dengue',
    fileUrl: 'https://res.cloudinary.com/medical-forum-vn/documents/dengue_treatment_guidelines.pdf',
    description:
      'Phác đồ chẩn đoán, phân loại mức độ và điều trị sốt xuất huyết Dengue theo khuyến cáo mới nhất của WHO và Bộ Y tế, phù hợp với điều kiện Việt Nam.',
    uploaderId: 'uploader1',
    categoryId: 'cat3',
    price: 0, // Free
    currency: 'VND',
    status: ResourceStatus.APPROVED,
    downloadCount: 9870,
    fileSize: 2800000, // 2.8MB
    fileType: 'PDF',
    thumbnail: 'https://images.unsplash.com/photo-1576089233775-8121f00a4309?w=500&h=300&fit=crop',
    tags: ['Sốt xuất huyết', 'Dengue', 'Phác đồ điều trị'],
    avgRating: 4.7,
    totalReviews: 67,
    soldCount: 0,
    createdAt: '2025-03-15T00:00:00.000Z',
    updatedAt: '2025-03-15T00:00:00.000Z',
    // Relationships
    uploader: mockUploaders[0],
    category: mockResourceCategories[2],
  },
  {
    _id: 'resource5',
    id: 'resource5',
    title: 'Kỹ thuật thực hành tiêm chủng an toàn',
    fileUrl: 'https://res.cloudinary.com/medical-forum-vn/documents/safe_injection_techniques.mp4',
    description:
      'Video hướng dẫn chi tiết các kỹ thuật tiêm chủng an toàn, bao gồm cách chuẩn bị, thực hiện và xử lý sau tiêm. Đặc biệt chú trọng vào an toàn cho người tiêm và người được tiêm.',
    uploaderId: 'uploader2',
    categoryId: 'cat5',
    price: 150000,
    currency: 'VND',
    status: ResourceStatus.APPROVED,
    downloadCount: 5620,
    fileSize: 256000000, // 256MB
    fileType: 'MP4',
    thumbnail: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=500&h=300&fit=crop',
    tags: ['Tiêm chủng', 'An toàn tiêm', 'Video hướng dẫn'],
    avgRating: 5.0,
    totalReviews: 210,
    soldCount: 120,
    createdAt: '2025-04-05T00:00:00.000Z',
    updatedAt: '2025-04-05T00:00:00.000Z',
    // Relationships
    uploader: mockUploaders[1],
    category: mockResourceCategories[4],
  },
  {
    _id: 'resource6',
    id: 'resource6',
    title: 'Nghiên cứu đánh giá hiệu quả điều trị tăng huyết áp bằng Y học cổ truyền',
    fileUrl: 'https://res.cloudinary.com/medical-forum-vn/documents/hypertension_traditional_medicine_research.docx',
    description:
      'Báo cáo nghiên cứu khoa học về hiệu quả của các phương pháp Y học cổ truyền trong điều trị tăng huyết áp, với số liệu từ nghiên cứu lâm sàng thực hiện tại 5 bệnh viện lớn trên toàn quốc.',
    uploaderId: 'uploader3',
    categoryId: 'cat2',
    price: 250000,
    currency: 'VND',
    status: ResourceStatus.APPROVED,
    downloadCount: 3245,
    fileSize: 8500000, // 8.5MB
    fileType: 'DOCX',
    thumbnail: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&h=300&fit=crop',
    tags: ['Cao huyết áp', 'YHCT', 'Nghiên cứu lâm sàng'],
    avgRating: 4.3,
    totalReviews: 15,
    soldCount: 45,
    createdAt: '2025-05-12T00:00:00.000Z',
    updatedAt: '2025-05-12T00:00:00.000Z',
    // Relationships
    uploader: mockUploaders[2],
    category: mockResourceCategories[1],
  },
  {
    _id: 'resource7',
    id: 'resource7',
    title: 'Hướng dẫn dinh dưỡng cho bệnh nhân ung thư trong quá trình hóa trị',
    fileUrl: 'https://res.cloudinary.com/medical-forum-vn/documents/nutrition_for_cancer_patients.pdf',
    description:
      'Tài liệu hướng dẫn chi tiết về chế độ dinh dưỡng cho bệnh nhân ung thư trong quá trình hóa trị, giúp giảm thiểu tác dụng phụ và tăng cường sức khỏe.',
    uploaderId: 'uploader1',
    categoryId: 'cat5',
    price: 0, // Free
    currency: 'VND',
    status: ResourceStatus.APPROVED,
    downloadCount: 7890,
    fileSize: 5100000, // 5.1MB
    fileType: 'PDF',
    thumbnail: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&h=300&fit=crop',
    tags: ['Dinh dưỡng', 'Ung thư', 'Hóa trị'],
    avgRating: 4.6,
    totalReviews: 98,
    soldCount: 0,
    createdAt: '2025-05-25T00:00:00.000Z',
    updatedAt: '2025-05-25T00:00:00.000Z',
    // Relationships
    uploader: mockUploaders[0],
    category: mockResourceCategories[4],
  },
  {
    _id: 'resource8',
    id: 'resource8',
    title: 'Bộ đề thi và đáp án môn Dược lý - Đại học Y Dược',
    fileUrl: 'https://res.cloudinary.com/medical-forum-vn/documents/pharmacology_exam_questions.zip',
    description:
      'Tổng hợp đề thi và đáp án chi tiết môn Dược lý đại cương và chuyên ngành từ năm 2020-2025, giúp sinh viên ôn tập hiệu quả.',
    uploaderId: 'uploader2',
    categoryId: 'cat1',
    price: 180000,
    currency: 'VND',
    status: ResourceStatus.APPROVED,
    downloadCount: 4560,
    fileSize: 45000000, // 45MB
    fileType: 'ZIP',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&h=300&fit=crop',
    tags: ['Dược lý', 'Đề thi', 'Ôn thi'],
    avgRating: 4.9,
    totalReviews: 320,
    soldCount: 890,
    createdAt: '2025-06-10T00:00:00.000Z',
    updatedAt: '2025-06-10T00:00:00.000Z',
    // Relationships
    uploader: mockUploaders[1],
    category: mockResourceCategories[0],
  },
];

// Featured resources (subset of mockResources)
export const featuredResources: Resource[] = [
  mockResources[0], // COVID-19 guide
  mockResources[2], // Essential medicines list
  mockResources[3], // Dengue treatment guidelines
  mockResources[4], // Safe injection techniques
  mockResources[6], // Nutrition for cancer patients
];
