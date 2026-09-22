import { Link } from 'react-router'

import {
  EnvironmentFilled,
  FacebookFilled,
  HeartFilled,
  MailFilled,
  PhoneFilled,
  YoutubeFilled,
} from '@ant-design/icons'

import fallbackLogo from '@/assets/images/logo.png'
import { APP_VERSION, BRAND_NAME } from '@/constants/brand'
import { PRIMARY_NAV_ITEMS } from '@/constants/nav'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { resolveUrl } from '@/utils/resolveUrl'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { settings } = useSiteSettings()
  const logoSrc = resolveUrl(settings.logoUrl) ?? fallbackLogo

  return (
    <footer className="border-neutral-3 border-t bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {/* Logo và thông tin */}
          <div className="col-span-2 flex flex-col gap-3 lg:col-span-1">
            <img
              src={logoSrc}
              alt={BRAND_NAME}
              className="h-16 w-auto object-contain"
              style={{ transformOrigin: 'left' }}
            />
            <p className="text-neutral-6 text-sm leading-relaxed">
              {settings.tagline ??
                'Nền tảng học tập dành cho sinh viên y khoa, cung cấp khóa học chuyên ngành và tài liệu y học chất lượng cao.'}
            </p>
            <div className="flex gap-1">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-5 hover:text-primary-6 rounded p-1.5 transition-colors"
                >
                  <FacebookFilled className="text-sm" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-5 hover:text-primary-6 rounded p-1.5 transition-colors"
                >
                  <YoutubeFilled className="text-sm" />
                </a>
              )}
            </div>
          </div>

          {/* Liên kết hữu ích */}
          <div className="flex flex-col gap-2">
            <h5 className="text-neutral-8 mb-1 text-sm font-semibold uppercase tracking-wider">
              Liên kết
            </h5>
            {['Trang chủ', 'Về chúng tôi', 'Điều khoản sử dụng', 'Chính sách bảo mật'].map(
              label => (
                <a
                  key={label}
                  href="/"
                  className="text-neutral-6 hover:text-primary-6 text-sm transition-colors"
                >
                  {label}
                </a>
              ),
            )}
          </div>

          {/* Danh mục — mirrors the header primary nav (shared PRIMARY_NAV_ITEMS)
              and uses react-router Link for real SPA navigation. */}
          <div className="flex flex-col gap-2">
            <h5 className="text-neutral-8 mb-1 text-sm font-semibold uppercase tracking-wider">
              Danh mục
            </h5>
            {/* Skip "Trang chủ" here — it already lives in the "Liên kết"
                column above. Header keeps it via the shared PRIMARY_NAV_ITEMS. */}
            {PRIMARY_NAV_ITEMS.filter(item => item.path !== '/').map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="text-neutral-6 hover:text-primary-6 text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Liên hệ */}
          <div className="flex flex-col gap-2">
            <h5 className="text-neutral-8 mb-1 text-sm font-semibold uppercase tracking-wider">
              Liên hệ
            </h5>
            {settings.contactAddress && (
              <div className="flex items-start gap-1.5">
                <EnvironmentFilled className="text-primary-6 mt-0.5 text-sm shrink-0" />
                <span className="text-neutral-6 text-sm leading-relaxed">
                  {settings.contactAddress}
                </span>
              </div>
            )}
            {settings.contactPhone && (
              <div className="flex items-center gap-1.5">
                <PhoneFilled className="text-primary-6 text-sm shrink-0" />
                <span className="text-neutral-6 text-sm">{settings.contactPhone}</span>
              </div>
            )}
            {settings.contactEmail && (
              <div className="flex items-center gap-1.5">
                <MailFilled className="text-primary-6 text-sm shrink-0" />
                <span className="text-neutral-6 text-sm">{settings.contactEmail}</span>
              </div>
            )}
          </div>
        </div>

        <hr className="border-neutral-3 my-4" />

        <div className="grid grid-cols-1 items-center gap-1 sm:grid-cols-3">
          <p className="text-neutral-5 text-sm">
            © {currentYear} {BRAND_NAME}. Tất cả quyền được bảo lưu.
          </p>
          <span className="text-neutral-5 text-center text-xs">Version {APP_VERSION}</span>
          <div className="text-neutral-5 flex items-center gap-1 text-sm sm:justify-self-end">
            <span>Phát triển với</span>
            <HeartFilled className="text-error-3 text-sm" />
            <span>bởi Đội ngũ {BRAND_NAME}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
