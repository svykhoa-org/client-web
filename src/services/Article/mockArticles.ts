import type { Article } from '@/models/Article'

export const mockArticles: Article[] = [
  {
    id: 'art_001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Cập nhật 2025: Điều trị viêm ruột thừa bằng nội soi trong phẫu thuật ngoại khoa',
    slug: 'cap-nhat-2025-dieu-tri-viem-ruot-thua-noi-soi',
    summary:
      'Bài viết cập nhật hướng dẫn mới nhất của Bộ Y tế về điều trị viêm ruột thừa bằng nội soi, kết hợp dữ liệu từ các nghiên cứu gần đây trên PubMed và ứng dụng trong thực tiễn lâm sàng tại Việt Nam.',
    content: `
            <h2>1. Tổng quan</h2>
            <p>Viêm ruột thừa là một trong những cấp cứu ngoại khoa phổ biến nhất. Nội soi đang dần thay thế phương pháp mổ hở truyền thống. Theo Hướng dẫn chẩn đoán và điều trị của Bộ Y tế Việt Nam 2025, nội soi là chỉ định ưu tiên nếu bệnh nhân không có chống chỉ định đặc biệt.</p>
            <h2>2. Cập nhật mới từ các nghiên cứu</h2>
            <p>Các nghiên cứu gần đây cho thấy nội soi làm giảm thời gian nằm viện trung bình 1.5 ngày, giảm biến chứng nhiễm trùng vết mổ và hồi phục nhanh hơn. <strong>Nghiên cứu bởi Trần Minh Phúc et al. (2024, Bệnh viện Chợ Rẫy)</strong> trên 524 ca cho thấy tỷ lệ biến chứng chỉ 3.1% so với 7.8% ở nhóm mổ hở.</p>
            <h2>3. Ứng dụng thực tiễn tại Việt Nam</h2>
            <p>Hiện tại, 85% bệnh viện tuyến tỉnh đã áp dụng kỹ thuật nội soi cơ bản. Tuy nhiên, một số khu vực miền núi vẫn thiếu trang thiết bị và bác sĩ chuyên môn sâu, cần có chiến lược đào tạo và hỗ trợ kỹ thuật lâu dài.</p>
            <h2>4. Kết luận</h2>
            <p>Nội soi đang là xu hướng điều trị hiệu quả, an toàn cho viêm ruột thừa, với tiềm năng thay đổi hoàn toàn cách tiếp cận điều trị ngoại khoa cấp cứu tại Việt Nam trong những năm tới.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>Hướng dẫn chẩn đoán và điều trị viêm ruột thừa, Bộ Y tế Việt Nam, 2025.</li>
                <li>Trần Minh Phúc et al., "So sánh kết quả điều trị viêm ruột thừa bằng nội soi và mổ hở", Tạp chí Y học Việt Nam, 2024.</li>
                <li>Nguyễn Văn A, "Ứng dụng nội soi trong ngoại khoa", Nhà xuất bản Y học, 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=1',
    author: {
      id: 'user_001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'thangvb@example.com',
      fullName: 'Thang Vu',
      avatarUrl: 'https://picsum.photos/200/200?random=1',
    },
    category: {
      id: 'cat_001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Y học hiện đại',
      slug: 'y-hoc-hien-dai',
      description: 'Các bài viết về y học hiện đại và công nghệ mới trong điều trị bệnh.',
      thumbnail: 'https://picsum.photos/300/300?random=1',
      isActive: true,
    },
    viewCount: 1500,
  },
  {
    id: 'art_002',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Ứng dụng trí tuệ nhân tạo trong chẩn đoán hình ảnh y khoa tại Việt Nam',
    slug: 'ung-dung-ai-trong-chan-doan-hinh-anh-y-khoa',
    summary:
      'Bài viết phân tích sự phát triển và ứng dụng của trí tuệ nhân tạo (AI) trong lĩnh vực chẩn đoán hình ảnh y khoa, đặc biệt là tại các bệnh viện lớn ở Việt Nam.',
    content: `
            <h2>1. Giới thiệu</h2>
            <p>Trí tuệ nhân tạo (AI) đang trở thành công cụ hỗ trợ đắc lực trong lĩnh vực y tế, đặc biệt là chẩn đoán hình ảnh. Các thuật toán học sâu (deep learning) đã chứng minh hiệu quả vượt trội trong việc phát hiện các bất thường trên phim X-quang, CT, MRI.</p>
            <h2>2. Ứng dụng thực tế tại Việt Nam</h2>
            <p>Bệnh viện Bạch Mai và Bệnh viện Chợ Rẫy đã triển khai hệ thống AI hỗ trợ đọc phim X-quang phổi, giúp giảm tải cho bác sĩ và tăng độ chính xác trong phát hiện tổn thương. Theo báo cáo năm 2024, tỷ lệ phát hiện sớm ung thư phổi tăng 15% nhờ AI.</p>
            <h2>3. Thách thức và giải pháp</h2>
            <p>Một số thách thức lớn bao gồm thiếu dữ liệu chuẩn hóa, chi phí đầu tư cao và cần đào tạo nhân lực. Bộ Y tế đang phối hợp với các trường đại học để xây dựng kho dữ liệu hình ảnh y khoa quốc gia, đồng thời hỗ trợ các bệnh viện tiếp cận công nghệ mới.</p>
            <h2>4. Triển vọng tương lai</h2>
            <p>AI sẽ tiếp tục phát triển mạnh mẽ, không chỉ trong chẩn đoán mà còn hỗ trợ điều trị và quản lý bệnh nhân. Dự kiến đến năm 2030, AI sẽ trở thành một phần không thể thiếu trong hệ thống y tế Việt Nam.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>Bộ Y tế, "Báo cáo ứng dụng AI trong y tế", 2024.</li>
                <li>Nguyễn Thị B, "AI và chẩn đoán hình ảnh", Tạp chí Công nghệ Y tế, 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=2',
    author: {
      id: 'user_002',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'nguyenvanb@example.com',
      fullName: 'Nguyễn Văn B',
      avatarUrl: 'https://picsum.photos/200/200?random=2',
    },
    category: {
      id: 'cat_002',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Công nghệ y tế',
      slug: 'cong-nghe-y-te',
      description: 'Các bài viết về công nghệ mới trong y tế.',
      thumbnail: 'https://picsum.photos/300/300?random=2',
      isActive: true,
    },
    viewCount: 1200,
  },
  {
    id: 'art_003',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Phòng ngừa và kiểm soát nhiễm khuẩn bệnh viện: Thực trạng và giải pháp',
    slug: 'phong-ngua-kiem-soat-nhiem-khuan-benh-vien',
    summary:
      'Bài viết trình bày thực trạng nhiễm khuẩn bệnh viện tại Việt Nam và các giải pháp kiểm soát hiệu quả dựa trên khuyến cáo của WHO.',
    content: `
            <h2>1. Thực trạng nhiễm khuẩn bệnh viện</h2>
            <p>Nhiễm khuẩn bệnh viện là vấn đề nghiêm trọng, ảnh hưởng đến chất lượng điều trị và an toàn người bệnh. Theo thống kê của Bộ Y tế năm 2023, tỷ lệ nhiễm khuẩn bệnh viện tại Việt Nam dao động từ 5-10%.</p>
            <h2>2. Nguyên nhân chính</h2>
            <p>Nguyên nhân bao gồm vệ sinh tay không đúng quy trình, thiết bị y tế chưa được tiệt khuẩn đầy đủ, và quá tải bệnh viện. Đặc biệt, các khoa hồi sức tích cực có tỷ lệ nhiễm khuẩn cao nhất.</p>
            <h2>3. Giải pháp kiểm soát</h2>
            <p>WHO khuyến cáo thực hiện 5 thời điểm vệ sinh tay, sử dụng thiết bị y tế vô khuẩn, và đào tạo liên tục cho nhân viên y tế. Một số bệnh viện lớn đã áp dụng hệ thống giám sát nhiễm khuẩn tự động, giúp giảm tỷ lệ nhiễm khuẩn xuống dưới 3%.</p>
            <h2>4. Kết luận</h2>
            <p>Kiểm soát nhiễm khuẩn bệnh viện là nhiệm vụ trọng tâm, cần sự phối hợp của toàn bộ hệ thống y tế. Đầu tư vào đào tạo và công nghệ là chìa khóa để nâng cao chất lượng chăm sóc sức khỏe.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>WHO, "Guidelines on Core Components of Infection Prevention and Control Programmes", 2022.</li>
                <li>Bộ Y tế, "Báo cáo kiểm soát nhiễm khuẩn", 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=3',
    author: {
      id: 'user_003',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'lethic@example.com',
      fullName: 'Lê Thị C',
      avatarUrl: 'https://picsum.photos/200/200?random=3',
    },
    category: {
      id: 'cat_003',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Quản lý bệnh viện',
      slug: 'quan-ly-benh-vien',
      description: 'Các bài viết về quản lý và vận hành bệnh viện.',
      thumbnail: 'https://picsum.photos/300/300?random=3',
      isActive: true,
    },
    viewCount: 980,
  },
  {
    id: 'art_004',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Tiến bộ trong điều trị ung thư vú: Liệu pháp miễn dịch và cá thể hóa',
    slug: 'tien-bo-dieu-tri-ung-thu-vu-lieu-phap-mien-dich',
    summary:
      'Bài viết cập nhật các tiến bộ mới nhất trong điều trị ung thư vú, tập trung vào liệu pháp miễn dịch và cá thể hóa điều trị.',
    content: `
            <h2>1. Tổng quan về ung thư vú</h2>
            <p>Ung thư vú là loại ung thư phổ biến nhất ở phụ nữ Việt Nam. Theo GLOBOCAN 2023, mỗi năm có hơn 21.000 ca mắc mới. Điều trị ung thư vú đã có nhiều tiến bộ, đặc biệt là liệu pháp miễn dịch và cá thể hóa.</p>
            <h2>2. Liệu pháp miễn dịch</h2>
            <p>Liệu pháp miễn dịch sử dụng các thuốc ức chế điểm kiểm soát miễn dịch (checkpoint inhibitors) như pembrolizumab, atezolizumab. Các nghiên cứu lâm sàng pha III cho thấy tỷ lệ sống thêm toàn bộ tăng đáng kể ở nhóm bệnh nhân có biểu hiện PD-L1 dương tính.</p>
            <h2>3. Cá thể hóa điều trị</h2>
            <p>Phân tích gen khối u giúp lựa chọn phác đồ tối ưu cho từng bệnh nhân. Xét nghiệm Oncotype DX, MammaPrint đã được triển khai tại một số bệnh viện lớn ở Việt Nam, giúp giảm tỷ lệ hóa trị không cần thiết.</p>
            <h2>4. Thách thức và triển vọng</h2>
            <p>Chi phí điều trị còn cao, bảo hiểm y tế chưa chi trả toàn bộ. Tuy nhiên, với sự hỗ trợ của các chương trình quốc gia, dự kiến trong 5 năm tới, nhiều bệnh nhân sẽ tiếp cận được các liệu pháp tiên tiến.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>GLOBOCAN, "Cancer Statistics in Vietnam", 2023.</li>
                <li>Nguyễn Thị D, "Liệu pháp miễn dịch trong ung thư vú", Tạp chí Ung thư học, 2024.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=4',
    author: {
      id: 'user_004',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'phamvand@example.com',
      fullName: 'Phạm Văn D',
      avatarUrl: 'https://picsum.photos/200/200?random=4',
    },
    category: {
      id: 'cat_004',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Ung thư học',
      slug: 'ung-thu-hoc',
      description: 'Các bài viết về ung thư và điều trị ung thư.',
      thumbnail: 'https://picsum.photos/300/300?random=4',
      isActive: true,
    },
    viewCount: 2100,
  },
  {
    id: 'art_005',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Chẩn đoán sớm đái tháo đường type 2 bằng xét nghiệm HbA1c',
    slug: 'chan-doan-som-dai-thao-duong-type-2-hba1c',
    summary:
      'Bài viết trình bày vai trò của xét nghiệm HbA1c trong chẩn đoán sớm và quản lý bệnh đái tháo đường type 2 tại Việt Nam.',
    content: `
            <h2>1. Đặt vấn đề</h2>
            <p>Đái tháo đường type 2 là bệnh mạn tính phổ biến, gây nhiều biến chứng nguy hiểm. Chẩn đoán sớm giúp kiểm soát bệnh tốt hơn và giảm nguy cơ biến chứng.</p>
            <h2>2. Xét nghiệm HbA1c</h2>
            <p>HbA1c phản ánh mức đường huyết trung bình trong 2-3 tháng. Theo khuyến cáo của ADA và Bộ Y tế Việt Nam, HbA1c ≥ 6.5% là tiêu chuẩn chẩn đoán đái tháo đường.</p>
            <h2>3. Ứng dụng tại Việt Nam</h2>
            <p>Nhiều bệnh viện đã triển khai xét nghiệm HbA1c thường quy. Tuy nhiên, ở vùng sâu vùng xa, việc tiếp cận còn hạn chế do chi phí và thiếu trang thiết bị.</p>
            <h2>4. Kết luận</h2>
            <p>Xét nghiệm HbA1c là công cụ hữu hiệu trong chẩn đoán và quản lý đái tháo đường type 2, cần được mở rộng áp dụng trên toàn quốc.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>ADA, "Standards of Medical Care in Diabetes", 2024.</li>
                <li>Bộ Y tế, "Hướng dẫn chẩn đoán và điều trị đái tháo đường", 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=5',
    author: {
      id: 'user_005',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'tranthie@example.com',
      fullName: 'Trần Thị E',
      avatarUrl: 'https://picsum.photos/200/200?random=5',
    },
    category: {
      id: 'cat_005',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Nội tiết',
      slug: 'noi-tiet',
      description: 'Các bài viết về bệnh nội tiết và chuyển hóa.',
      thumbnail: 'https://picsum.photos/300/300?random=5',
      isActive: true,
    },
    viewCount: 800,
  },
  {
    id: 'art_006',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Vai trò của dinh dưỡng trong phục hồi sau phẫu thuật',
    slug: 'vai-tro-dinh-duong-phuc-hoi-sau-phau-thuat',
    summary:
      'Bài viết phân tích tầm quan trọng của dinh dưỡng trong quá trình phục hồi sau phẫu thuật, dựa trên các nghiên cứu mới nhất.',
    content: `
            <h2>1. Tổng quan</h2>
            <p>Dinh dưỡng hợp lý giúp bệnh nhân phục hồi nhanh hơn sau phẫu thuật, giảm nguy cơ biến chứng và rút ngắn thời gian nằm viện.</p>
            <h2>2. Các yếu tố dinh dưỡng cần thiết</h2>
            <p>Protein, vitamin, khoáng chất và năng lượng là các yếu tố quan trọng. Bệnh nhân cần được đánh giá tình trạng dinh dưỡng trước và sau mổ để xây dựng chế độ ăn phù hợp.</p>
            <h2>3. Ứng dụng thực tiễn</h2>
            <p>Nhiều bệnh viện đã áp dụng phác đồ dinh dưỡng cá thể hóa, kết hợp bổ sung dinh dưỡng đường tĩnh mạch và đường uống. Kết quả cho thấy tỷ lệ biến chứng giảm 20% so với nhóm không được hỗ trợ dinh dưỡng chuyên sâu.</p>
            <h2>4. Kết luận</h2>
            <p>Dinh dưỡng là yếu tố then chốt trong phục hồi sau phẫu thuật, cần được chú trọng trong mọi phác đồ điều trị.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>ESPEN, "Guidelines on Clinical Nutrition in Surgery", 2023.</li>
                <li>Nguyễn Văn F, "Dinh dưỡng lâm sàng", Nhà xuất bản Y học, 2022.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=6',
    author: {
      id: 'user_006',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'nguyenvanf@example.com',
      fullName: 'Nguyễn Văn F',
      avatarUrl: 'https://picsum.photos/200/200?random=6',
    },
    category: {
      id: 'cat_006',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Dinh dưỡng lâm sàng',
      slug: 'dinh-duong-lam-sang',
      description: 'Các bài viết về dinh dưỡng trong điều trị bệnh.',
      thumbnail: 'https://picsum.photos/300/300?random=6',
      isActive: true,
    },
    viewCount: 670,
  },
  {
    id: 'art_007',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Cập nhật điều trị tăng huyết áp theo khuyến cáo ESC/ESH 2023',
    slug: 'cap-nhat-dieu-tri-tang-huyet-ap-esc-esh-2023',
    summary:
      'Bài viết cập nhật các điểm mới trong điều trị tăng huyết áp theo khuyến cáo của ESC/ESH năm 2023.',
    content: `
            <h2>1. Tổng quan về tăng huyết áp</h2>
            <p>Tăng huyết áp là yếu tố nguy cơ hàng đầu gây bệnh tim mạch và đột quỵ. Theo thống kê, khoảng 25% người trưởng thành Việt Nam mắc tăng huyết áp.</p>
            <h2>2. Khuyến cáo ESC/ESH 2023</h2>
            <p>Khuyến cáo mới nhấn mạnh kiểm soát huyết áp mục tiêu dưới 130/80 mmHg cho hầu hết bệnh nhân. Ưu tiên sử dụng phối hợp thuốc ngay từ đầu, đặc biệt là nhóm ức chế men chuyển, chẹn thụ thể và lợi tiểu.</p>
            <h2>3. Ứng dụng tại Việt Nam</h2>
            <p>Nhiều bệnh viện đã cập nhật phác đồ điều trị theo ESC/ESH. Tuy nhiên, tỷ lệ kiểm soát huyết áp còn thấp do tuân thủ điều trị chưa tốt và thiếu thuốc ở tuyến cơ sở.</p>
            <h2>4. Kết luận</h2>
            <p>Cần tăng cường giáo dục sức khỏe và đảm bảo cung ứng thuốc để nâng cao hiệu quả kiểm soát tăng huyết áp.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>ESC/ESH, "Guidelines for the management of arterial hypertension", 2023.</li>
                <li>Bộ Y tế, "Hướng dẫn điều trị tăng huyết áp", 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=7',
    author: {
      id: 'user_007',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'lethig@example.com',
      fullName: 'Lê Thị G',
      avatarUrl: 'https://picsum.photos/200/200?random=7',
    },
    category: {
      id: 'cat_007',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Tim mạch',
      slug: 'tim-mach',
      description: 'Các bài viết về bệnh tim mạch và huyết áp.',
      thumbnail: 'https://picsum.photos/300/300?random=7',
      isActive: true,
    },
    viewCount: 1100,
  },
  {
    id: 'art_008',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Phát hiện sớm ung thư cổ tử cung bằng xét nghiệm HPV DNA',
    slug: 'phat-hien-som-ung-thu-co-tu-cung-hpv-dna',
    summary:
      'Bài viết trình bày vai trò của xét nghiệm HPV DNA trong phát hiện sớm ung thư cổ tử cung và khuyến cáo mới nhất của Bộ Y tế.',
    content: `
            <h2>1. Tổng quan về ung thư cổ tử cung</h2>
            <p>Ung thư cổ tử cung là nguyên nhân gây tử vong hàng đầu ở phụ nữ Việt Nam. Phát hiện sớm giúp tăng tỷ lệ sống thêm và giảm chi phí điều trị.</p>
            <h2>2. Xét nghiệm HPV DNA</h2>
            <p>Xét nghiệm HPV DNA có độ nhạy cao hơn so với Pap smear truyền thống. Khuyến cáo thực hiện định kỳ 3-5 năm/lần cho phụ nữ từ 30 tuổi trở lên.</p>
            <h2>3. Ứng dụng tại Việt Nam</h2>
            <p>Nhiều chương trình tầm soát cộng đồng đã triển khai xét nghiệm HPV DNA, giúp phát hiện sớm các trường hợp nguy cơ cao và can thiệp kịp thời.</p>
            <h2>4. Kết luận</h2>
            <p>Xét nghiệm HPV DNA là bước tiến lớn trong phòng ngừa và phát hiện sớm ung thư cổ tử cung tại Việt Nam.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>Bộ Y tế, "Hướng dẫn tầm soát ung thư cổ tử cung", 2024.</li>
                <li>WHO, "Cervical cancer screening guidelines", 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=8',
    author: {
      id: 'user_008',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'phamthih@example.com',
      fullName: 'Phạm Thị H',
      avatarUrl: 'https://picsum.photos/200/200?random=8',
    },
    category: {
      id: 'cat_008',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Sản phụ khoa',
      slug: 'san-phu-khoa',
      description: 'Các bài viết về sản phụ khoa và sức khỏe phụ nữ.',
      thumbnail: 'https://picsum.photos/300/300?random=8',
      isActive: true,
    },
    viewCount: 900,
  },
  {
    id: 'art_009',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Cập nhật 2025: Điều trị viêm ruột thừa bằng nội soi trong phẫu thuật ngoại khoa',
    slug: 'cap-nhat-2025-dieu-tri-viem-ruot-thua-noi-soi',
    summary:
      'Bài viết cập nhật hướng dẫn mới nhất của Bộ Y tế về điều trị viêm ruột thừa bằng nội soi, kết hợp dữ liệu từ các nghiên cứu gần đây trên PubMed và ứng dụng trong thực tiễn lâm sàng tại Việt Nam.',
    content: `
            <h2>1. Tổng quan</h2>
            <p>Viêm ruột thừa là một trong những cấp cứu ngoại khoa phổ biến nhất. Nội soi đang dần thay thế phương pháp mổ hở truyền thống. Theo Hướng dẫn chẩn đoán và điều trị của Bộ Y tế Việt Nam 2025, nội soi là chỉ định ưu tiên nếu bệnh nhân không có chống chỉ định đặc biệt.</p>
            <h2>2. Cập nhật mới từ các nghiên cứu</h2>
            <p>Các nghiên cứu gần đây cho thấy nội soi làm giảm thời gian nằm viện trung bình 1.5 ngày, giảm biến chứng nhiễm trùng vết mổ và hồi phục nhanh hơn. <strong>Nghiên cứu bởi Trần Minh Phúc et al. (2024, Bệnh viện Chợ Rẫy)</strong> trên 524 ca cho thấy tỷ lệ biến chứng chỉ 3.1% so với 7.8% ở nhóm mổ hở.</p>
            <h2>3. Ứng dụng thực tiễn tại Việt Nam</h2>
            <p>Hiện tại, 85% bệnh viện tuyến tỉnh đã áp dụng kỹ thuật nội soi cơ bản. Tuy nhiên, một số khu vực miền núi vẫn thiếu trang thiết bị và bác sĩ chuyên môn sâu, cần có chiến lược đào tạo và hỗ trợ kỹ thuật lâu dài.</p>
            <h2>4. Kết luận</h2>
            <p>Nội soi đang là xu hướng điều trị hiệu quả, an toàn cho viêm ruột thừa, với tiềm năng thay đổi hoàn toàn cách tiếp cận điều trị ngoại khoa cấp cứu tại Việt Nam trong những năm tới.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>Hướng dẫn chẩn đoán và điều trị viêm ruột thừa, Bộ Y tế Việt Nam, 2025.</li>
                <li>Trần Minh Phúc et al., "So sánh kết quả điều trị viêm ruột thừa bằng nội soi và mổ hở", Tạp chí Y học Việt Nam, 2024.</li>
                <li>Nguyễn Văn A, "Ứng dụng nội soi trong ngoại khoa", Nhà xuất bản Y học, 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=1',
    author: {
      id: 'user_001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'thangvb@example.com',
      fullName: 'Thang Vu',
      avatarUrl: 'https://picsum.photos/200/200?random=1',
    },
    category: {
      id: 'cat_001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Y học hiện đại',
      slug: 'y-hoc-hien-dai',
      description: 'Các bài viết về y học hiện đại và công nghệ mới trong điều trị bệnh.',
      thumbnail: 'https://picsum.photos/300/300?random=1',
      isActive: true,
    },
    viewCount: 1500,
  },
  {
    id: 'art_010',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Ứng dụng trí tuệ nhân tạo trong chẩn đoán hình ảnh y khoa tại Việt Nam',
    slug: 'ung-dung-ai-trong-chan-doan-hinh-anh-y-khoa',
    summary:
      'Bài viết phân tích sự phát triển và ứng dụng của trí tuệ nhân tạo (AI) trong lĩnh vực chẩn đoán hình ảnh y khoa, đặc biệt là tại các bệnh viện lớn ở Việt Nam.',
    content: `
            <h2>1. Giới thiệu</h2>
            <p>Trí tuệ nhân tạo (AI) đang trở thành công cụ hỗ trợ đắc lực trong lĩnh vực y tế, đặc biệt là chẩn đoán hình ảnh. Các thuật toán học sâu (deep learning) đã chứng minh hiệu quả vượt trội trong việc phát hiện các bất thường trên phim X-quang, CT, MRI.</p>
            <h2>2. Ứng dụng thực tế tại Việt Nam</h2>
            <p>Bệnh viện Bạch Mai và Bệnh viện Chợ Rẫy đã triển khai hệ thống AI hỗ trợ đọc phim X-quang phổi, giúp giảm tải cho bác sĩ và tăng độ chính xác trong phát hiện tổn thương. Theo báo cáo năm 2024, tỷ lệ phát hiện sớm ung thư phổi tăng 15% nhờ AI.</p>
            <h2>3. Thách thức và giải pháp</h2>
            <p>Một số thách thức lớn bao gồm thiếu dữ liệu chuẩn hóa, chi phí đầu tư cao và cần đào tạo nhân lực. Bộ Y tế đang phối hợp với các trường đại học để xây dựng kho dữ liệu hình ảnh y khoa quốc gia, đồng thời hỗ trợ các bệnh viện tiếp cận công nghệ mới.</p>
            <h2>4. Triển vọng tương lai</h2>
            <p>AI sẽ tiếp tục phát triển mạnh mẽ, không chỉ trong chẩn đoán mà còn hỗ trợ điều trị và quản lý bệnh nhân. Dự kiến đến năm 2030, AI sẽ trở thành một phần không thể thiếu trong hệ thống y tế Việt Nam.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>Bộ Y tế, "Báo cáo ứng dụng AI trong y tế", 2024.</li>
                <li>Nguyễn Thị B, "AI và chẩn đoán hình ảnh", Tạp chí Công nghệ Y tế, 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=2',
    author: {
      id: 'user_002',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'nguyenvanb@example.com',
      fullName: 'Nguyễn Văn B',
      avatarUrl: 'https://picsum.photos/200/200?random=2',
    },
    category: {
      id: 'cat_002',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Công nghệ y tế',
      slug: 'cong-nghe-y-te',
      description: 'Các bài viết về công nghệ mới trong y tế.',
      thumbnail: 'https://picsum.photos/300/300?random=2',
      isActive: true,
    },
    viewCount: 1200,
  },
  {
    id: 'art_011',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Phòng ngừa và kiểm soát nhiễm khuẩn bệnh viện: Thực trạng và giải pháp',
    slug: 'phong-ngua-kiem-soat-nhiem-khuan-benh-vien',
    summary:
      'Bài viết trình bày thực trạng nhiễm khuẩn bệnh viện tại Việt Nam và các giải pháp kiểm soát hiệu quả dựa trên khuyến cáo của WHO.',
    content: `
            <h2>1. Thực trạng nhiễm khuẩn bệnh viện</h2>
            <p>Nhiễm khuẩn bệnh viện là vấn đề nghiêm trọng, ảnh hưởng đến chất lượng điều trị và an toàn người bệnh. Theo thống kê của Bộ Y tế năm 2023, tỷ lệ nhiễm khuẩn bệnh viện tại Việt Nam dao động từ 5-10%.</p>
            <h2>2. Nguyên nhân chính</h2>
            <p>Nguyên nhân bao gồm vệ sinh tay không đúng quy trình, thiết bị y tế chưa được tiệt khuẩn đầy đủ, và quá tải bệnh viện. Đặc biệt, các khoa hồi sức tích cực có tỷ lệ nhiễm khuẩn cao nhất.</p>
            <h2>3. Giải pháp kiểm soát</h2>
            <p>WHO khuyến cáo thực hiện 5 thời điểm vệ sinh tay, sử dụng thiết bị y tế vô khuẩn, và đào tạo liên tục cho nhân viên y tế. Một số bệnh viện lớn đã áp dụng hệ thống giám sát nhiễm khuẩn tự động, giúp giảm tỷ lệ nhiễm khuẩn xuống dưới 3%.</p>
            <h2>4. Kết luận</h2>
            <p>Kiểm soát nhiễm khuẩn bệnh viện là nhiệm vụ trọng tâm, cần sự phối hợp của toàn bộ hệ thống y tế. Đầu tư vào đào tạo và công nghệ là chìa khóa để nâng cao chất lượng chăm sóc sức khỏe.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>WHO, "Guidelines on Core Components of Infection Prevention and Control Programmes", 2022.</li>
                <li>Bộ Y tế, "Báo cáo kiểm soát nhiễm khuẩn", 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=3',
    author: {
      id: 'user_003',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'lethic@example.com',
      fullName: 'Lê Thị C',
      avatarUrl: 'https://picsum.photos/200/200?random=3',
    },
    category: {
      id: 'cat_003',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Quản lý bệnh viện',
      slug: 'quan-ly-benh-vien',
      description: 'Các bài viết về quản lý và vận hành bệnh viện.',
      thumbnail: 'https://picsum.photos/300/300?random=3',
      isActive: true,
    },
    viewCount: 980,
  },
  {
    id: 'art_012',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Tiến bộ trong điều trị ung thư vú: Liệu pháp miễn dịch và cá thể hóa',
    slug: 'tien-bo-dieu-tri-ung-thu-vu-lieu-phap-mien-dich',
    summary:
      'Bài viết cập nhật các tiến bộ mới nhất trong điều trị ung thư vú, tập trung vào liệu pháp miễn dịch và cá thể hóa điều trị.',
    content: `
            <h2>1. Tổng quan về ung thư vú</h2>
            <p>Ung thư vú là loại ung thư phổ biến nhất ở phụ nữ Việt Nam. Theo GLOBOCAN 2023, mỗi năm có hơn 21.000 ca mắc mới. Điều trị ung thư vú đã có nhiều tiến bộ, đặc biệt là liệu pháp miễn dịch và cá thể hóa.</p>
            <h2>2. Liệu pháp miễn dịch</h2>
            <p>Liệu pháp miễn dịch sử dụng các thuốc ức chế điểm kiểm soát miễn dịch (checkpoint inhibitors) như pembrolizumab, atezolizumab. Các nghiên cứu lâm sàng pha III cho thấy tỷ lệ sống thêm toàn bộ tăng đáng kể ở nhóm bệnh nhân có biểu hiện PD-L1 dương tính.</p>
            <h2>3. Cá thể hóa điều trị</h2>
            <p>Phân tích gen khối u giúp lựa chọn phác đồ tối ưu cho từng bệnh nhân. Xét nghiệm Oncotype DX, MammaPrint đã được triển khai tại một số bệnh viện lớn ở Việt Nam, giúp giảm tỷ lệ hóa trị không cần thiết.</p>
            <h2>4. Thách thức và triển vọng</h2>
            <p>Chi phí điều trị còn cao, bảo hiểm y tế chưa chi trả toàn bộ. Tuy nhiên, với sự hỗ trợ của các chương trình quốc gia, dự kiến trong 5 năm tới, nhiều bệnh nhân sẽ tiếp cận được các liệu pháp tiên tiến.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>GLOBOCAN, "Cancer Statistics in Vietnam", 2023.</li>
                <li>Nguyễn Thị D, "Liệu pháp miễn dịch trong ung thư vú", Tạp chí Ung thư học, 2024.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=4',
    author: {
      id: 'user_004',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'phamvand@example.com',
      fullName: 'Phạm Văn D',
      avatarUrl: 'https://picsum.photos/200/200?random=4',
    },
    category: {
      id: 'cat_004',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Ung thư học',
      slug: 'ung-thu-hoc',
      description: 'Các bài viết về ung thư và điều trị ung thư.',
      thumbnail: 'https://picsum.photos/300/300?random=4',
      isActive: true,
    },
    viewCount: 2100,
  },
  {
    id: 'art_013',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Chẩn đoán sớm đái tháo đường type 2 bằng xét nghiệm HbA1c',
    slug: 'chan-doan-som-dai-thao-duong-type-2-hba1c',
    summary:
      'Bài viết trình bày vai trò của xét nghiệm HbA1c trong chẩn đoán sớm và quản lý bệnh đái tháo đường type 2 tại Việt Nam.',
    content: `
            <h2>1. Đặt vấn đề</h2>
            <p>Đái tháo đường type 2 là bệnh mạn tính phổ biến, gây nhiều biến chứng nguy hiểm. Chẩn đoán sớm giúp kiểm soát bệnh tốt hơn và giảm nguy cơ biến chứng.</p>
            <h2>2. Xét nghiệm HbA1c</h2>
            <p>HbA1c phản ánh mức đường huyết trung bình trong 2-3 tháng. Theo khuyến cáo của ADA và Bộ Y tế Việt Nam, HbA1c ≥ 6.5% là tiêu chuẩn chẩn đoán đái tháo đường.</p>
            <h2>3. Ứng dụng tại Việt Nam</h2>
            <p>Nhiều bệnh viện đã triển khai xét nghiệm HbA1c thường quy. Tuy nhiên, ở vùng sâu vùng xa, việc tiếp cận còn hạn chế do chi phí và thiếu trang thiết bị.</p>
            <h2>4. Kết luận</h2>
            <p>Xét nghiệm HbA1c là công cụ hữu hiệu trong chẩn đoán và quản lý đái tháo đường type 2, cần được mở rộng áp dụng trên toàn quốc.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>ADA, "Standards of Medical Care in Diabetes", 2024.</li>
                <li>Bộ Y tế, "Hướng dẫn chẩn đoán và điều trị đái tháo đường", 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=5',
    author: {
      id: 'user_005',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'tranthie@example.com',
      fullName: 'Trần Thị E',
      avatarUrl: 'https://picsum.photos/200/200?random=5',
    },
    category: {
      id: 'cat_005',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Nội tiết',
      slug: 'noi-tiet',
      description: 'Các bài viết về bệnh nội tiết và chuyển hóa.',
      thumbnail: 'https://picsum.photos/300/300?random=5',
      isActive: true,
    },
    viewCount: 800,
  },
  {
    id: 'art_014',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Vai trò của dinh dưỡng trong phục hồi sau phẫu thuật',
    slug: 'vai-tro-dinh-duong-phuc-hoi-sau-phau-thuat',
    summary:
      'Bài viết phân tích tầm quan trọng của dinh dưỡng trong quá trình phục hồi sau phẫu thuật, dựa trên các nghiên cứu mới nhất.',
    content: `
            <h2>1. Tổng quan</h2>
            <p>Dinh dưỡng hợp lý giúp bệnh nhân phục hồi nhanh hơn sau phẫu thuật, giảm nguy cơ biến chứng và rút ngắn thời gian nằm viện.</p>
            <h2>2. Các yếu tố dinh dưỡng cần thiết</h2>
            <p>Protein, vitamin, khoáng chất và năng lượng là các yếu tố quan trọng. Bệnh nhân cần được đánh giá tình trạng dinh dưỡng trước và sau mổ để xây dựng chế độ ăn phù hợp.</p>
            <h2>3. Ứng dụng thực tiễn</h2>
            <p>Nhiều bệnh viện đã áp dụng phác đồ dinh dưỡng cá thể hóa, kết hợp bổ sung dinh dưỡng đường tĩnh mạch và đường uống. Kết quả cho thấy tỷ lệ biến chứng giảm 20% so với nhóm không được hỗ trợ dinh dưỡng chuyên sâu.</p>
            <h2>4. Kết luận</h2>
            <p>Dinh dưỡng là yếu tố then chốt trong phục hồi sau phẫu thuật, cần được chú trọng trong mọi phác đồ điều trị.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>ESPEN, "Guidelines on Clinical Nutrition in Surgery", 2023.</li>
                <li>Nguyễn Văn F, "Dinh dưỡng lâm sàng", Nhà xuất bản Y học, 2022.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=6',
    author: {
      id: 'user_006',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'nguyenvanf@example.com',
      fullName: 'Nguyễn Văn F',
      avatarUrl: 'https://picsum.photos/200/200?random=6',
    },
    category: {
      id: 'cat_006',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Dinh dưỡng lâm sàng',
      slug: 'dinh-duong-lam-sang',
      description: 'Các bài viết về dinh dưỡng trong điều trị bệnh.',
      thumbnail: 'https://picsum.photos/300/300?random=6',
      isActive: true,
    },
    viewCount: 670,
  },
  {
    id: 'art_015',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Cập nhật điều trị tăng huyết áp theo khuyến cáo ESC/ESH 2023',
    slug: 'cap-nhat-dieu-tri-tang-huyet-ap-esc-esh-2023',
    summary:
      'Bài viết cập nhật các điểm mới trong điều trị tăng huyết áp theo khuyến cáo của ESC/ESH năm 2023.',
    content: `
            <h2>1. Tổng quan về tăng huyết áp</h2>
            <p>Tăng huyết áp là yếu tố nguy cơ hàng đầu gây bệnh tim mạch và đột quỵ. Theo thống kê, khoảng 25% người trưởng thành Việt Nam mắc tăng huyết áp.</p>
            <h2>2. Khuyến cáo ESC/ESH 2023</h2>
            <p>Khuyến cáo mới nhấn mạnh kiểm soát huyết áp mục tiêu dưới 130/80 mmHg cho hầu hết bệnh nhân. Ưu tiên sử dụng phối hợp thuốc ngay từ đầu, đặc biệt là nhóm ức chế men chuyển, chẹn thụ thể và lợi tiểu.</p>
            <h2>3. Ứng dụng tại Việt Nam</h2>
            <p>Nhiều bệnh viện đã cập nhật phác đồ điều trị theo ESC/ESH. Tuy nhiên, tỷ lệ kiểm soát huyết áp còn thấp do tuân thủ điều trị chưa tốt và thiếu thuốc ở tuyến cơ sở.</p>
            <h2>4. Kết luận</h2>
            <p>Cần tăng cường giáo dục sức khỏe và đảm bảo cung ứng thuốc để nâng cao hiệu quả kiểm soát tăng huyết áp.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>ESC/ESH, "Guidelines for the management of arterial hypertension", 2023.</li>
                <li>Bộ Y tế, "Hướng dẫn điều trị tăng huyết áp", 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=7',
    author: {
      id: 'user_007',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'lethig@example.com',
      fullName: 'Lê Thị G',
      avatarUrl: 'https://picsum.photos/200/200?random=7',
    },
    category: {
      id: 'cat_007',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Tim mạch',
      slug: 'tim-mach',
      description: 'Các bài viết về bệnh tim mạch và huyết áp.',
      thumbnail: 'https://picsum.photos/300/300?random=7',
      isActive: true,
    },
    viewCount: 1100,
  },
  {
    id: 'art_016',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Phát hiện sớm ung thư cổ tử cung bằng xét nghiệm HPV DNA',
    slug: 'phat-hien-som-ung-thu-co-tu-cung-hpv-dna',
    summary:
      'Bài viết trình bày vai trò của xét nghiệm HPV DNA trong phát hiện sớm ung thư cổ tử cung và khuyến cáo mới nhất của Bộ Y tế.',
    content: `
            <h2>1. Tổng quan về ung thư cổ tử cung</h2>
            <p>Ung thư cổ tử cung là nguyên nhân gây tử vong hàng đầu ở phụ nữ Việt Nam. Phát hiện sớm giúp tăng tỷ lệ sống thêm và giảm chi phí điều trị.</p>
            <h2>2. Xét nghiệm HPV DNA</h2>
            <p>Xét nghiệm HPV DNA có độ nhạy cao hơn so với Pap smear truyền thống. Khuyến cáo thực hiện định kỳ 3-5 năm/lần cho phụ nữ từ 30 tuổi trở lên.</p>
            <h2>3. Ứng dụng tại Việt Nam</h2>
            <p>Nhiều chương trình tầm soát cộng đồng đã triển khai xét nghiệm HPV DNA, giúp phát hiện sớm các trường hợp nguy cơ cao và can thiệp kịp thời.</p>
            <h2>4. Kết luận</h2>
            <p>Xét nghiệm HPV DNA là bước tiến lớn trong phòng ngừa và phát hiện sớm ung thư cổ tử cung tại Việt Nam.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>Bộ Y tế, "Hướng dẫn tầm soát ung thư cổ tử cung", 2024.</li>
                <li>WHO, "Cervical cancer screening guidelines", 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=8',
    author: {
      id: 'user_008',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'phamthih@example.com',
      fullName: 'Phạm Thị H',
      avatarUrl: 'https://picsum.photos/200/200?random=8',
    },
    category: {
      id: 'cat_008',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Sản phụ khoa',
      slug: 'san-phu-khoa',
      description: 'Các bài viết về sản phụ khoa và sức khỏe phụ nữ.',
      thumbnail: 'https://picsum.photos/300/300?random=8',
      isActive: true,
    },
    viewCount: 900,
  },
  {
    id: 'art_017',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Vai trò của dinh dưỡng trong phục hồi sau phẫu thuật',
    slug: 'vai-tro-dinh-duong-phuc-hoi-sau-phau-thuat',
    summary:
      'Bài viết phân tích tầm quan trọng của dinh dưỡng trong quá trình phục hồi sau phẫu thuật, dựa trên các nghiên cứu mới nhất.',
    content: `
            <h2>1. Tổng quan</h2>
            <p>Dinh dưỡng hợp lý giúp bệnh nhân phục hồi nhanh hơn sau phẫu thuật, giảm nguy cơ biến chứng và rút ngắn thời gian nằm viện.</p>
            <h2>2. Các yếu tố dinh dưỡng cần thiết</h2>
            <p>Protein, vitamin, khoáng chất và năng lượng là các yếu tố quan trọng. Bệnh nhân cần được đánh giá tình trạng dinh dưỡng trước và sau mổ để xây dựng chế độ ăn phù hợp.</p>
            <h2>3. Ứng dụng thực tiễn</h2>
            <p>Nhiều bệnh viện đã áp dụng phác đồ dinh dưỡng cá thể hóa, kết hợp bổ sung dinh dưỡng đường tĩnh mạch và đường uống. Kết quả cho thấy tỷ lệ biến chứng giảm 20% so với nhóm không được hỗ trợ dinh dưỡng chuyên sâu.</p>
            <h2>4. Kết luận</h2>
            <p>Dinh dưỡng là yếu tố then chốt trong phục hồi sau phẫu thuật, cần được chú trọng trong mọi phác đồ điều trị.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>ESPEN, "Guidelines on Clinical Nutrition in Surgery", 2023.</li>
                <li>Nguyễn Văn F, "Dinh dưỡng lâm sàng", Nhà xuất bản Y học, 2022.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=6',
    author: {
      id: 'user_006',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'nguyenvanf@example.com',
      fullName: 'Nguyễn Văn F',
      avatarUrl: 'https://picsum.photos/200/200?random=6',
    },
    category: {
      id: 'cat_006',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Dinh dưỡng lâm sàng',
      slug: 'dinh-duong-lam-sang',
      description: 'Các bài viết về dinh dưỡng trong điều trị bệnh.',
      thumbnail: 'https://picsum.photos/300/300?random=6',
      isActive: true,
    },
    viewCount: 670,
  },
  {
    id: 'art_018',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Cập nhật điều trị tăng huyết áp theo khuyến cáo ESC/ESH 2023',
    slug: 'cap-nhat-dieu-tri-tang-huyet-ap-esc-esh-2023',
    summary:
      'Bài viết cập nhật các điểm mới trong điều trị tăng huyết áp theo khuyến cáo của ESC/ESH năm 2023.',
    content: `
            <h2>1. Tổng quan về tăng huyết áp</h2>
            <p>Tăng huyết áp là yếu tố nguy cơ hàng đầu gây bệnh tim mạch và đột quỵ. Theo thống kê, khoảng 25% người trưởng thành Việt Nam mắc tăng huyết áp.</p>
            <h2>2. Khuyến cáo ESC/ESH 2023</h2>
            <p>Khuyến cáo mới nhấn mạnh kiểm soát huyết áp mục tiêu dưới 130/80 mmHg cho hầu hết bệnh nhân. Ưu tiên sử dụng phối hợp thuốc ngay từ đầu, đặc biệt là nhóm ức chế men chuyển, chẹn thụ thể và lợi tiểu.</p>
            <h2>3. Ứng dụng tại Việt Nam</h2>
            <p>Nhiều bệnh viện đã cập nhật phác đồ điều trị theo ESC/ESH. Tuy nhiên, tỷ lệ kiểm soát huyết áp còn thấp do tuân thủ điều trị chưa tốt và thiếu thuốc ở tuyến cơ sở.</p>
            <h2>4. Kết luận</h2>
            <p>Cần tăng cường giáo dục sức khỏe và đảm bảo cung ứng thuốc để nâng cao hiệu quả kiểm soát tăng huyết áp.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>ESC/ESH, "Guidelines for the management of arterial hypertension", 2023.</li>
                <li>Bộ Y tế, "Hướng dẫn điều trị tăng huyết áp", 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=7',
    author: {
      id: 'user_007',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'lethig@example.com',
      fullName: 'Lê Thị G',
      avatarUrl: 'https://picsum.photos/200/200?random=7',
    },
    category: {
      id: 'cat_007',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Tim mạch',
      slug: 'tim-mach',
      description: 'Các bài viết về bệnh tim mạch và huyết áp.',
      thumbnail: 'https://picsum.photos/300/300?random=7',
      isActive: true,
    },
    viewCount: 1100,
  },
  {
    id: 'art_019',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Phát hiện sớm ung thư cổ tử cung bằng xét nghiệm HPV DNA',
    slug: 'phat-hien-som-ung-thu-co-tu-cung-hpv-dna',
    summary:
      'Bài viết trình bày vai trò của xét nghiệm HPV DNA trong phát hiện sớm ung thư cổ tử cung và khuyến cáo mới nhất của Bộ Y tế.',
    content: `
            <h2>1. Tổng quan về ung thư cổ tử cung</h2>
            <p>Ung thư cổ tử cung là nguyên nhân gây tử vong hàng đầu ở phụ nữ Việt Nam. Phát hiện sớm giúp tăng tỷ lệ sống thêm và giảm chi phí điều trị.</p>
            <h2>2. Xét nghiệm HPV DNA</h2>
            <p>Xét nghiệm HPV DNA có độ nhạy cao hơn so với Pap smear truyền thống. Khuyến cáo thực hiện định kỳ 3-5 năm/lần cho phụ nữ từ 30 tuổi trở lên.</p>
            <h2>3. Ứng dụng tại Việt Nam</h2>
            <p>Nhiều chương trình tầm soát cộng đồng đã triển khai xét nghiệm HPV DNA, giúp phát hiện sớm các trường hợp nguy cơ cao và can thiệp kịp thời.</p>
            <h2>4. Kết luận</h2>
            <p>Xét nghiệm HPV DNA là bước tiến lớn trong phòng ngừa và phát hiện sớm ung thư cổ tử cung tại Việt Nam.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>Bộ Y tế, "Hướng dẫn tầm soát ung thư cổ tử cung", 2024.</li>
                <li>WHO, "Cervical cancer screening guidelines", 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=8',
    author: {
      id: 'user_008',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'phamthih@example.com',
      fullName: 'Phạm Thị H',
      avatarUrl: 'https://picsum.photos/200/200?random=8',
    },
    category: {
      id: 'cat_008',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Sản phụ khoa',
      slug: 'san-phu-khoa',
      description: 'Các bài viết về sản phụ khoa và sức khỏe phụ nữ.',
      thumbnail: 'https://picsum.photos/300/300?random=8',
      isActive: true,
    },
    viewCount: 900,
  },
  {
    id: 'art_020',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'Phát hiện sớm ung thư cổ tử cung bằng xét nghiệm HPV DNA',
    slug: 'phat-hien-som-ung-thu-co-tu-cung-hpv-dna',
    summary:
      'Bài viết trình bày vai trò của xét nghiệm HPV DNA trong phát hiện sớm ung thư cổ tử cung và khuyến cáo mới nhất của Bộ Y tế.',
    content: `
            <h2>1. Tổng quan về ung thư cổ tử cung</h2>
            <p>Ung thư cổ tử cung là nguyên nhân gây tử vong hàng đầu ở phụ nữ Việt Nam. Phát hiện sớm giúp tăng tỷ lệ sống thêm và giảm chi phí điều trị.</p>
            <h2>2. Xét nghiệm HPV DNA</h2>
            <p>Xét nghiệm HPV DNA có độ nhạy cao hơn so với Pap smear truyền thống. Khuyến cáo thực hiện định kỳ 3-5 năm/lần cho phụ nữ từ 30 tuổi trở lên.</p>
            <h2>3. Ứng dụng tại Việt Nam</h2>
            <p>Nhiều chương trình tầm soát cộng đồng đã triển khai xét nghiệm HPV DNA, giúp phát hiện sớm các trường hợp nguy cơ cao và can thiệp kịp thời.</p>
            <h2>4. Kết luận</h2>
            <p>Xét nghiệm HPV DNA là bước tiến lớn trong phòng ngừa và phát hiện sớm ung thư cổ tử cung tại Việt Nam.</p>
            <h2>5. Tài liệu tham khảo</h2>
            <ul>
                <li>Bộ Y tế, "Hướng dẫn tầm soát ung thư cổ tử cung", 2024.</li>
                <li>WHO, "Cervical cancer screening guidelines", 2023.</li>
            </ul>
        `,
    thumbnail: 'https://picsum.photos/500/500?random=8',
    author: {
      id: 'user_008',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'phamthih@example.com',
      fullName: 'Phạm Thị H',
      avatarUrl: 'https://picsum.photos/200/200?random=8',
    },
    category: {
      id: 'cat_008',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Sản phụ khoa',
      slug: 'san-phu-khoa',
      description: 'Các bài viết về sản phụ khoa và sức khỏe phụ nữ.',
      thumbnail: 'https://picsum.photos/300/300?random=8',
      isActive: true,
    },
    viewCount: 900,
  },
]
