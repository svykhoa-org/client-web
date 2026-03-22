import {
  EnvironmentFilled,
  FacebookFilled,
  HeartFilled,
  MailFilled,
  MedicineBoxFilled,
  PhoneFilled,
  TwitterOutlined,
  YoutubeFilled,
} from '@ant-design/icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-1 border-neutral-3 border-t pt-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo và thông tin */}
          <div className="flex flex-col gap-4">
            <h4 className="text-primary-6 mb-0 text-xl font-semibold">
              <MedicineBoxFilled className="mr-2" />
              SVYKHOA
            </h4>
            <p className="text-neutral-7">
              Nền tảng học tập trực tuyến dành cho sinh viên y khoa, cung cấp khóa học chuyên ngành và tài liệu y học
              chất lượng cao.
            </p>
            <div className="flex gap-2">
              <button className="text-primary-6 hover:text-primary-5 p-2 text-lg">
                <FacebookFilled />
              </button>
              <button className="text-primary-6 hover:text-primary-5 p-2 text-lg">
                <TwitterOutlined />
              </button>
              <button className="text-primary-6 hover:text-primary-5 p-2 text-lg">
                <YoutubeFilled />
              </button>
            </div>
          </div>

          {/* Liên kết hữu ích */}
          <div>
            <h5 className="text-neutral-8 mb-4 text-lg font-medium">Liên kết hữu ích</h5>
            <div className="flex flex-col gap-2">
              <a href="/" className="text-neutral-7 hover:text-primary-6">
                Trang chủ
              </a>
              <a href="/" className="text-neutral-7 hover:text-primary-6">
                Về chúng tôi
              </a>
              <a href="/" className="text-neutral-7 hover:text-primary-6">
                Điều khoản sử dụng
              </a>
              <a href="/" className="text-neutral-7 hover:text-primary-6">
                Chính sách bảo mật
              </a>
            </div>
          </div>

          {/* Danh mục */}
          <div>
            <h5 className="text-neutral-8 mb-4 text-lg font-medium">Danh mục</h5>
            <div className="flex flex-col gap-2">
              <a href="/" className="text-neutral-7 hover:text-primary-6">
                Sức khỏe tổng quát
              </a>
              <a href="/" className="text-neutral-7 hover:text-primary-6">
                Dược phẩm
              </a>
              <a href="/" className="text-neutral-7 hover:text-primary-6">
                Dinh dưỡng
              </a>
              <a href="/" className="text-neutral-7 hover:text-primary-6">
                Sức khỏe tinh thần
              </a>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h5 className="text-neutral-8 mb-4 text-lg font-medium">Liên hệ</h5>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <EnvironmentFilled className="text-primary-6" />
                <span className="text-neutral-7">123 Đường Y Học, Quận Sức Khỏe, TP. Hà Nội</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneFilled className="text-primary-6" />
                <span className="text-neutral-7">+84 (0)123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <MailFilled className="text-primary-6" />
                <span className="text-neutral-7">contact@diendanyduoc.vn</span>
              </div>
              <div className="mt-3">
                <button className="bg-primary-6 hover:bg-primary-5 rounded-md px-4 py-2 text-white">
                  Liên hệ ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-neutral-3 my-6" />

        <div className="text-center">
          <p className="text-neutral-6">© {currentYear} Diễn đàn Y dược Việt Nam. Tất cả quyền được bảo lưu.</p>
          <div className="text-neutral-6 mt-2 flex items-center justify-center text-sm">
            <span>Phát triển với</span>
            <HeartFilled className="text-error-3 mx-1" />
            <span>bởi Đội ngũ Diễn đàn Y dược</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
