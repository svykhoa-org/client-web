import type { Category } from '@/models/Category'
import type { Post } from '@/models/Post'
import { PostStatus } from '@/models/Post'
import type { Author } from '@/models/User'

// Mock authors
const mockAuthors: Author[] = [
  {
    id: 'author1',
    fullName: 'PGS.TS Nguyễn Thanh Liêm',
    avatarUrl:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'author2',
    fullName: 'TS.BS Trần Thị Minh Phương',
    avatarUrl:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'author3',
    fullName: 'BS.CKII Lê Văn Hòa',
    avatarUrl:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'author4',
    fullName: 'PGS.TS Phạm Thị Thu Hà',
    avatarUrl:
      'https://images.unsplash.com/photo-1594824488253-b66ef22493c2?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'author5',
    fullName: 'TS.BS Hoàng Minh Đức',
    avatarUrl:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'author6',
    fullName: 'BS.CKI Võ Thị Lan Anh',
    avatarUrl:
      'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'author7',
    fullName: 'PGS.TS Ngô Văn Toàn',
    avatarUrl:
      'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'author8',
    fullName: 'TS.BS Đặng Thị Hương',
    avatarUrl:
      'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'author9',
    fullName: 'BS.CKII Trương Minh Khải',
    avatarUrl:
      'https://images.unsplash.com/photo-1643297654240-0c1aa24159ba?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'author10',
    fullName: 'TS.BS Phan Thị Mai',
    avatarUrl:
      'https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?w=100&h=100&fit=crop&crop=face',
  },
]

// Mock categories
const mockCategoriesForPosts: Category[] = [
  {
    id: 'cat1',
    name: 'Tim mạch',
    description: 'Các bệnh lý về tim mạch',
    slug: 'tim-mach',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat2',
    name: 'Nội tiết',
    description: 'Bệnh lý nội tiết',
    slug: 'noi-tiet',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat3',
    name: 'Hô hấp',
    description: 'Các bệnh lý về đường hô hấp',
    slug: 'ho-hap',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat4',
    name: 'Tiêu hóa',
    description: 'Bệnh lý về đường tiêu hóa',
    slug: 'tieu-hoa',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat5',
    name: 'Thần kinh',
    description: 'Các bệnh lý thần kinh',
    slug: 'than-kinh',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat6',
    name: 'Ung thư',
    description: 'Nghiên cứu và điều trị ung thư',
    slug: 'ung-thu',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat7',
    name: 'Nhi khoa',
    description: 'Chăm sóc sức khỏe trẻ em',
    slug: 'nhi-khoa',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat8',
    name: 'Sản phụ khoa',
    description: 'Sức khỏe phụ nữ',
    slug: 'san-phu-khoa',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat9',
    name: 'Da liễu',
    description: 'Các bệnh lý về da',
    slug: 'da-lieu',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat10',
    name: 'Mắt',
    description: 'Các bệnh lý về mắt',
    slug: 'mat',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
]

function getRandomAuthor(): Author {
  return mockAuthors[Math.floor(Math.random() * mockAuthors.length)]
}

function getRandomCategory(): Category {
  return mockCategoriesForPosts[Math.floor(Math.random() * mockCategoriesForPosts.length)]
}

function getRandomDate(): string {
  const start = new Date('2024-01-01')
  const end = new Date('2025-08-24')
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
  return new Date(randomTime).toISOString()
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Main featured posts with detailed content
const featuredPosts: Post[] = [
  {
    id: 'post1',
    title: 'Nghiên cứu mới về điều trị suy tim mạn tính bằng tế bào gốc',
    content: `Một nghiên cứu đột phá từ Viện Tim mạch Quốc gia đã chứng minh hiệu quả của liệu pháp tế bào gốc trong điều trị suy tim mạn tính. Nghiên cứu được thực hiện trên 200 bệnh nhân trong 2 năm với kết quả đáng khích lệ.

**Phương pháp nghiên cứu:**
Các nhà nghiên cứu đã sử dụng tế bào gốc trung mô từ mô mỡ của chính bệnh nhân, sau đó nuôi cấy và tăng sinh trong phòng thí nghiệm. Tế bào được tiêm trực tiếp vào cơ tim thông qua phẫu thuật nội soi ít xâm lấn.

**Kết quả quan trọng:**
- Cải thiện chức năng tim 35% sau 6 tháng điều trị
- Giảm 60% tỷ lệ nhập viện do suy tim
- Không có biến chứng nghiêm trọng nào được ghi nhận
- EF (ejection fraction) tăng từ trung bình 25% lên 40%

**Cơ chế tác động:**
Tế bào gốc có khả năng biệt hóa thành các tế bào cơ tim mới, đồng thời tiết ra các yếu tố sinh trưởng giúp tái tạo mạch máu và cải thiện chức năng tim. Điều này đặc biệt quan trọng với những bệnh nhân có tổn thương tim không hồi phục.

**Ý nghĩa lâm sàng:**
Nghiên cứu này mở ra hướng điều trị mới cho hàng triệu bệnh nhân suy tim trên thế giới. Đây là bước tiến quan trọng trong y học tái sinh, đặc biệt khi các phương pháp điều trị truyền thống đã đạt giới hạn.

**Triển vọng tương lai:**
Nhóm nghiên cứu đang tiến hành thử nghiệm lâm sàng giai đoạn III với quy mô lớn hơn để xác nhận hiệu quả và an toàn dài hạn. Dự kiến liệu pháp này sẽ được ứng dụng rộng rãi trong vòng 3-5 năm tới.`,
    tags: ['tim mạch', 'tế bào gốc', 'suy tim', 'nghiên cứu', 'y học tái sinh'],
    isPinned: true,
    commentCount: 45,
    viewCount: 1520,
    status: PostStatus.Published,
    authorId: 'author1',
    categoryId: 'cat1',
    author: mockAuthors[0],
    category: mockCategoriesForPosts[0],
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  },
  {
    id: 'post2',
    title: 'Phát hiện gen mới liên quan đến bệnh tiểu đường type 2 ở người Việt Nam',
    content: `Nhóm nghiên cứu của Đại học Y Hà Nội phối hợp với Viện Nghiên cứu Gene Stanford đã phát hiện một biến thể gen mới có liên quan chặt chẽ đến nguy cơ mắc bệnh tiểu đường type 2 ở người Việt Nam.

**Bối cảnh nghiên cứu:**
Bệnh tiểu đường type 2 đang gia tăng nhanh chóng tại Việt Nam với tỷ lệ mắc bệnh tăng 15% mỗi năm. Việc hiểu rõ yếu tố di truyền sẽ giúp phòng ngừa và điều trị hiệu quả hơn.

**Phương pháp và quy mô:**
- Phân tích genome của 5.000 người Việt Nam
- So sánh giữa 2.500 bệnh nhân tiểu đường và 2.500 người khỏe mạnh
- Sử dụng công nghệ giải trình tự genome thế hệ mới
- Xác thực kết quả qua 3 trung tâm nghiên cứu độc lập

**Phát hiện quan trọng:**
Biến thể gen được đặt tên VN-T2D1 nằm trên nhiễm sắc thể 11, ảnh hưởng đến chức năng của tế bào beta tuyến tụy. Người mang biến thể này có nguy cơ mắc tiểu đường type 2 cao gấp 3.2 lần so với người bình thường.

**Ứng dụng thực tiễn:**
1. **Sàng lọc sớm:** Xét nghiệm gen có thể phát hiện nguy cơ từ tuổi trẻ
2. **Tư vấn di truyền:** Giúp các gia đình có kế hoạch phòng ngừa phù hợp
3. **Điều trị cá thể hóa:** Lựa chọn thuốc phù hợp dựa trên profile gen
4. **Nghiên cứu thuốc mới:** Phát triển thuốc nhắm vào đích phân tử cụ thể`,
    tags: ['tiểu đường', 'di truyền', 'gen', 'nghiên cứu', 'người Việt'],
    isPinned: false,
    commentCount: 67,
    viewCount: 2340,
    status: PostStatus.Published,
    authorId: 'author2',
    categoryId: 'cat2',
    author: mockAuthors[1],
    category: mockCategoriesForPosts[1],
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  },
  {
    id: 'post3',
    title: 'Breakthrough trong điều trị COVID-19 kéo dài: Liệu pháp kháng thể đơn dòng mới',
    content: `Viện Pasteur TP.HCM vừa công bố kết quả thử nghiệm thành công liệu pháp kháng thể đơn dòng mới trong điều trị hội chứng COVID-19 kéo dài (Long COVID), mở ra hy vọng cho hàng triệu bệnh nhân trên toàn thế giới.

**Vấn đề Long COVID:**
Khoảng 10-20% bệnh nhân COVID-19 tiếp tục có triệu chứng sau khi khỏi bệnh cấp tính, bao gồm:
- Mệt mỏi kéo dài
- Khó thở
- Suy giảm nhận thức ("brain fog")
- Đau cơ và khớp
- Rối loạn giấc ngủ
- Trầm cảm và lo âu

**Cơ chế bệnh sinh:**
Nghiên cứu cho thấy Long COVID có thể do virus SARS-CoV-2 tồn tại trong các "kho chứa" (reservoir) trong cơ thể, gây ra phản ứng viêm mạn tính và rối loạn miễn dịch.

**Liệu pháp kháng thể đơn dòng mới:**
Kháng thể được thiết kế đặc biệt để:
1. Trung hòa các protein virus còn sót lại
2. Điều hòa phản ứng miễn dịch
3. Giảm viêm mạn tính
4. Bảo vệ tế bào thần kinh khỏi tổn thương

**Kết quả thử nghiệm lâm sàng:**
- 120 bệnh nhân Long COVID tham gia nghiên cứu
- 78% cải thiện đáng kể sau 4 tuần điều trị
- Giảm 60% mức độ mệt mỏi
- Cải thiện 45% chức năng nhận thức
- 52% bệnh nhân trở lại làm việc toàn thời gian`,
    tags: ['COVID-19', 'Long COVID', 'kháng thể', 'điều trị', 'AI'],
    isPinned: true,
    commentCount: 89,
    viewCount: 3420,
    status: PostStatus.Published,
    authorId: 'author3',
    categoryId: 'cat3',
    author: mockAuthors[2],
    category: mockCategoriesForPosts[2],
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  },
]

// Generate additional posts
const postTitles = [
  'Ứng dụng AI trong chẩn đoán hình ảnh y học tại Việt Nam',
  'Phương pháp mới điều trị rối loạn lo âu ở trẻ em bằng VR',
  'Vaccine mRNA cho bệnh cúm mùa: Hiệu quả vượt trội 92%',
  'Phẫu thuật nội soi điều trị thoát vị đĩa đệm không cần mở lưng',
  'Liệu pháp gen CRISPR cho bệnh thalassemia đầu tiên tại ASEAN',
  'Chăm sóc da chuyên biệt cho bệnh nhân ung thư trong hóa trị',
  'Điều trị tăng huyết áp ở người cao tuổi: Cập nhật guideline 2025',
  'Phòng ngừa biến chứng tiểu đường tuýp 2 bằng lifestyle medicine',
  'Ứng dụng telemedicine trong y tế vùng cao Việt Nam',
  'Điều trị mất ngủ mạn tính không cần thuốc: CBT-I hiệu quả 85%',
  'Phát hiện sớm ung thư vú qua xét nghiệm máu liquid biopsy',
  'Liệu pháp vật lý trị liệu robot cho bệnh nhân đột quỵ',
  'Chế độ ăn ketogenic trong điều trị động kinh kháng thuốc',
  'Phẫu thuật robot Da Vinci điều trị ung thư tuyến tiền liệt',
  'Điều trị viêm khớp dạng thấp bằng thuốc sinh học mới',
  'Ứng dụng blockchain bảo mật hồ sơ y tế điện tử',
  'Liệu pháp âm nhạc cải thiện trí nhớ cho bệnh nhân Alzheimer',
  'Điều trị rối loạn phổ tự kỷ ở trẻ em: Phương pháp ABA hiện đại',
  'Phòng ngừa suy thận mạn tính từ bệnh tiểu đường',
  'Ứng dụng in 3D tạo mô ghép trong phẫu thuật tạo hình',
  'Điều trị ung thư phổi giai đoạn muộn bằng immunotherapy',
  'Phẫu thuật tim hở ít xâm lấn qua mini-thoracotomy',
  'Điều trị bệnh Parkinson bằng kích thích não sâu DBS',
  'Liệu pháp tế bào gốc cho thoái hóa khớp gối',
  'Phát triển thuốc nhắm trúng đích cho ung thư gan',
  'Điều trị trầm cảm kháng thuốc bằng TMS',
  'Phẫu thuật nội soi điều trị bệnh reflux dạ dày',
  'Liệu pháp hormone thay thế cho phụ nữ mãn kinh',
  'Điều trị động kinh bằng phẫu thuật stereotactic',
  'Ứng dụng nano-medicine trong điều trị ung thư',
  'Phòng ngừa đột quỵ não ở bệnh nhân rung nhĩ',
  'Điều trị viêm gan B mạn tính bằng thuốc kháng virus mới',
  'Phẫu thuật cấy ốc tai điện tử cho trẻ điếc bẩm sinh',
  'Liệu pháp miễn dịch cho bệnh đa xơ cứng',
  'Điều trị loãng xương sau mãn kinh: Cập nhật 2025',
  'Phẫu thuật robot điều trị ung thư thực quản',
  'Điều trị hen suyễn nặng bằng thuốc sinh học',
  'Liệu pháp tế bào CAR-T cho lymphoma tái phát',
  'Phòng ngừa các bệnh tim mạch bằng AI prediction',
  'Điều trị bệnh Crohn bằng thuốc ức chế JAK',
]

const detailedContents = [
  `Viện Nghiên cứu AI Y tế Việt Nam đã phát triển thành công hệ thống trí tuệ nhân tạo có khả năng chẩn đoán chính xác 95% các bệnh lý qua hình ảnh X-quang, CT và MRI.

**Công nghệ áp dụng:**
Hệ thống sử dụng thuật toán deep learning được huấn luyện trên hơn 2 triệu hình ảnh y tế từ 50 bệnh viện lớn trong cả nước. AI có thể phát hiện:
- Ung thư phổi giai đoạn sớm (độ nhạy 94%)
- Đột quỵ não cấp (chẩn đoán trong 3 phút)
- Gãy xương (chính xác 98%)
- Viêm phổi và COVID-19 (độ đặc hiệu 96%)

**Ưu điểm vượt trội:**
- Giảm thời gian chẩn đoán từ 2-3 ngày xuống 30 phút
- Hỗ trợ bác sĩ tại các vùng xa không có chuyên gia
- Phát hiện được các tổn thương nhỏ mà mắt thường bỏ sót
- Tích hợp với PACS của bệnh viện một cách liền mạch

**Triển khai thực tế:**
Hiện tại, 25 bệnh viện đã triển khai thử nghiệm với kết quả khả quan. Dự kiến sẽ mở rộng ra 100 bệnh viện trong năm 2025.`,

  `Bệnh viện Nhi Trung ương đã thành công trong việc áp dụng công nghệ thực tế ảo (VR) kết hợp với liệu pháp nhận thức hành vi (CBT) để điều trị rối loạn lo âu ở trẻ em.

**Vấn đề cấp bách:**
Tỷ lệ trẻ em mắc rối loạn lo âu tại Việt Nam tăng 25% trong 5 năm qua, chủ yếu do:
- Áp lực học tập quá mức
- Ảnh hưởng tiêu cực của mạng xã hội
- Môi trường gia đình căng thẳng
- Thiếu kỹ năng xử lý cảm xúc

**Liệu pháp VR-CBT:**
Trẻ em được đưa vào môi trường ảo an toàn để:
- Đối mặt với nỗi sợ một cách từ từ
- Học cách thư giãn và kiểm soát hơi thở
- Thực hành kỹ năng xã hội
- Xây dựng lại sự tự tin

**Kết quả đáng khích lệ:**
Sau 8 tuần điều trị:
- 85% trẻ giảm mức độ lo âu
- 70% cải thiện khả năng giao tiếp xã hội
- 90% phụ huynh hài lòng với kết quả
- Không có tác dụng phụ nào được báo cáo`,

  `Công ty dược phẩm Nanogen Việt Nam đã hoàn thành thành công thử nghiệm lâm sàng Phase III cho vaccine mRNA cúm mùa, đạt hiệu quả bảo vệ 92% - cao hơn đáng kể so với vaccine truyền thống.

**Ưu thế công nghệ mRNA:**
- Thời gian sản xuất nhanh: 2-3 tháng thay vì 6 tháng
- Khả năng thích ứng nhanh với virus biến đổi
- Hiệu quả cao hơn ở người cao tuổi (87% vs 45%)
- Ít tác dụng phụ hơn vaccine truyền thống

**Kết quả thử nghiệm:**
Nghiên cứu trên 30.000 người tham gia tại 3 nước ASEAN:
- Hiệu quả bảo vệ: 92% (CI 95%: 87-96%)
- An toàn: Chỉ 2% tác dụng phụ nhẹ
- Kháng thể duy trì 12 tháng
- Hiệu quả với mọi độ tuổi từ 6 tháng tuổi

**Ý nghĩa kinh tế:**
Vaccine sản xuất trong nước sẽ giúp Việt Nam:
- Tiết kiệm 200 triệu USD chi phí nhập khẩu
- Đảm bảo an ninh vaccine quốc gia
- Xuất khẩu sang các nước ASEAN
- Tạo việc làm cho 5.000 lao động`,

  `Bệnh viện Việt Đức đã thực hiện thành công 500 ca phẫu thuật nội soi điều trị thoát vị đĩa đệm bằng kỹ thuật PELD (Percutaneous Endoscopic Lumbar Discectomy) với tỷ lệ thành công 98%.

**Ưu điểm của kỹ thuật PELD:**
- Đường mổ chỉ 7mm, không cần cắt cơ
- Thời gian phẫu thuật: 30-45 phút
- Bệnh nhân có thể đi lại sau 6 giờ
- Xuất viện sau 1-2 ngày
- Không để lại scar lớn

**Chỉ định phẫu thuật:**
- Thoát vị đĩa đệm L4-L5, L5-S1
- Đau thần kinh tọa kháng thuốc
- Không đáp ứng với điều trị bảo tồn 6 tuần
- Chức năng thần kinh còn tốt

**So sánh với phẫu thuật mở:**
| Tiêu chí | PELD | Phẫu thuật mở |
|----------|------|---------------|
| Đường mổ | 7mm | 3-5cm |
| Thời gian phẫu thuật | 45 phút | 2 giờ |
| Thời gian nằm viện | 1-2 ngày | 5-7 ngày |
| Hồi phục | 2 tuần | 6-8 tuần |

**Kết quả dài hạn:**
Theo dõi 2 năm sau phẫu thuật:
- 95% bệnh nhân hài lòng
- Tỷ lệ tái phát: 3%
- 90% trở lại công việc bình thường
- Không có biến chứng nghiêm trọng`,
]

const additionalPosts: Post[] = Array.from({ length: 97 }, (_, index) => {
  const postId = `post${index + 4}`
  const author = getRandomAuthor()
  const category = getRandomCategory()
  const titleIndex = index % postTitles.length
  const contentIndex = index % detailedContents.length

  return {
    id: postId,
    title: postTitles[titleIndex],
    content: detailedContents[contentIndex],
    tags: ['y học', 'nghiên cứu', 'điều trị', 'công nghệ', 'Việt Nam'],
    isPinned: Math.random() < 0.05, // 5% posts được pin
    commentCount: getRandomInt(3, 180),
    viewCount: getRandomInt(50, 8000),
    status: PostStatus.Published,
    authorId: author.id,
    categoryId: category.id!,
    author,
    category,
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  }
})

export const allMockPosts: Post[] = [...featuredPosts, ...additionalPosts]
