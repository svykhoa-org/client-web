import { EnvironmentFilled, FacebookFilled, HeartFilled, MailFilled, PhoneFilled, YoutubeFilled } from '@ant-design/icons';

import logoImage from '@/assets/images/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-neutral-3 border-t bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {/* Logo và thông tin */}
          <div className="col-span-2 flex flex-col gap-3 lg:col-span-1">
            <img src={logoImage} alt="SVYKHOA" className="h-8 w-auto object-contain" style={{ transformOrigin: 'left' }} />
            <p className="text-neutral-6 text-sm leading-relaxed">
              Nền tảng học tập dành cho sinh viên y khoa, cung cấp khóa học chuyên ngành và tài liệu y học chất lượng cao.
            </p>
            <div className="flex gap-1">
              <button className="text-neutral-5 hover:text-primary-6 rounded p-1.5 transition-colors">
                <FacebookFilled className="text-sm" />
              </button>
              <button className="text-neutral-5 hover:text-primary-6 rounded p-1.5 transition-colors">
                <YoutubeFilled className="text-sm" />
              </button>
            </div>
          </div>

          {/* Liên kết hữu ích */}
          <div className="flex flex-col gap-2">
            <h5 className="text-neutral-8 mb-1 text-sm font-semibold uppercase tracking-wider">Liên kết</h5>
            {['Trang chủ', 'Về chúng tôi', 'Điều khoản sử dụng', 'Chính sách bảo mật'].map(label => (
              <a key={label} href="/" className="text-neutral-6 hover:text-primary-6 text-sm transition-colors">
                {label}
              </a>
            ))}
          </div>

          {/* Danh mục */}
          <div className="flex flex-col gap-2">
            <h5 className="text-neutral-8 mb-1 text-sm font-semibold uppercase tracking-wider">Danh mục</h5>
            {['Sức khỏe tổng quát', 'Dược phẩm', 'Dinh dưỡng', 'Sức khỏe tinh thần'].map(label => (
              <a key={label} href="/" className="text-neutral-6 hover:text-primary-6 text-sm transition-colors">
                {label}
              </a>
            ))}
          </div>

          {/* Liên hệ */}
          <div className="flex flex-col gap-2">
            <h5 className="text-neutral-8 mb-1 text-sm font-semibold uppercase tracking-wider">Liên hệ</h5>
            <div className="flex items-start gap-1.5">
              <EnvironmentFilled className="text-primary-6 mt-0.5 text-sm shrink-0" />
              <span className="text-neutral-6 text-sm leading-relaxed">123 Đường Y Học, TP. Hà Nội</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhoneFilled className="text-primary-6 text-sm shrink-0" />
              <span className="text-neutral-6 text-sm">+84 (0)123 456 789</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MailFilled className="text-primary-6 text-sm shrink-0" />
              <span className="text-neutral-6 text-sm">contact@svykhoa.vn</span>
            </div>
          </div>
        </div>

        <hr className="border-neutral-3 my-4" />

        <div className="flex flex-col items-center justify-between gap-1 sm:flex-row">
          <p className="text-neutral-5 text-sm">© {currentYear} SVYKHOA. Tất cả quyền được bảo lưu.</p>
          <div className="text-neutral-5 flex items-center gap-1 text-sm">
            <span>Phát triển với</span>
            <HeartFilled className="text-error-3 text-sm" />
            <span>bởi Đội ngũ SVYKHOA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
