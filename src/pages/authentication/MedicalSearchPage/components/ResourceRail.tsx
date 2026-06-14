import { Link } from 'react-router'

import { ArrowRight, FileText, GraduationCap } from 'lucide-react'

import defaultThumbnail from '@/assets/course-thumbnail-default.jpeg'
import RouteConfig from '@/constants/RouteConfig'
import { cn } from '@/lib/utils'
import type { Document } from '@/models/Document'
import { RoutePath } from '@/routes'
import { getPublicUrl } from '@/utils/getPublicUrl'
import type { CourseApiItem } from '@/types/course-api'

interface ResourceRailProps {
  courses: CourseApiItem[]
  documents: Document[]
  loading: boolean
  /** When false the section stays in skeleton state (answer still streaming). */
  ready: boolean
}

const resolveDocThumbnail = (document: Document) => {
  const thumb = document.thumbnail
  if (!thumb) return undefined
  if (thumb.url?.startsWith('http')) return thumb.url
  return getPublicUrl(thumb)
}

const formatPrice = (price: number) =>
  price === 0 ? 'Miễn phí' : `${price.toLocaleString('vi-VN')}đ`

// Horizontal scroll strip: same behaviour on mobile and desktop, scrollbar
// hidden. Cards snap into place. Shared by real content and skeletons so the
// loading state stays responsive too.
const Strip = ({ children }: { children: React.ReactNode }) => (
  <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
    {children}
  </div>
)

const RailCard = ({
  to,
  thumbnail,
  fallback,
  title,
  meta,
  price,
  free,
}: {
  to: string
  thumbnail?: string
  fallback: React.ReactNode
  title: string
  meta: string
  price: string
  free: boolean
}) => (
  <Link
    to={to}
    className={cn(
      'group flex w-[240px] shrink-0 snap-start gap-3 rounded-xl border border-neutral-3 bg-white p-3 sm:w-[280px]',
      'shadow-sm transition-all duration-200',
      'hover:border-primary-3 hover:-translate-y-0.5 hover:shadow-md',
    )}
  >
    <div className="bg-primary-1 flex aspect-square w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={e => {
            ;(e.target as HTMLImageElement).src = defaultThumbnail
          }}
        />
      ) : (
        fallback
      )}
    </div>

    <div className="flex min-w-0 flex-1 flex-col">
      <h4 className="group-hover:text-primary-8 line-clamp-2 text-sm font-semibold leading-snug text-neutral-10 transition-colors">
        {title}
      </h4>
      <span className="mt-1 line-clamp-1 text-xs text-neutral-5">{meta}</span>
      <span
        className={cn(
          'mt-auto pt-1.5 text-sm font-bold tabular-nums',
          free ? 'text-success-3' : 'text-primary-8',
        )}
      >
        {price}
      </span>
    </div>
  </Link>
)

const SkeletonCard = () => (
  <div className="flex w-[240px] shrink-0 gap-3 rounded-xl border border-neutral-3 bg-white p-3 sm:w-[280px]">
    <div className="bg-neutral-3/70 aspect-square w-16 shrink-0 animate-pulse rounded-lg" />
    <div className="flex flex-1 flex-col gap-2 py-1">
      <div className="bg-neutral-3/70 h-3 w-full animate-pulse rounded-full" />
      <div className="bg-neutral-3/70 h-3 w-3/4 animate-pulse rounded-full" />
      <div className="bg-neutral-3/70 mt-auto h-3 w-1/3 animate-pulse rounded-full" />
    </div>
  </div>
)

const Group = ({
  icon,
  title,
  action,
  children,
}: {
  icon: React.ReactNode
  title: string
  action?: { label: string; to: string }
  children: React.ReactNode
}) => (
  <div>
    <div className="mb-2.5 flex items-center justify-between">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-9">
        {icon}
        {title}
      </h3>
      {action && (
        <Link
          to={action.to}
          className="text-primary-7 hover:text-primary-8 inline-flex items-center gap-0.5 text-xs font-medium"
        >
          {action.label}
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
    <Strip>{children}</Strip>
  </div>
)

export const ResourceRail = ({ courses, documents, loading, ready }: ResourceRailProps) => {
  const showSkeleton = !ready || loading
  const hasContent = courses.length > 0 || documents.length > 0

  if (!showSkeleton && !hasContent) return null

  return (
    <section className="mt-10 border-t border-neutral-2 pt-7">
      <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-neutral-5">
        Tài nguyên liên quan
      </p>

      {showSkeleton ? (
        <div className="flex flex-col gap-6">
          <Group icon={<GraduationCap size={15} className="text-primary-6" />} title="Khóa học CME">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </Group>
          <Group
            icon={<FileText size={15} className="text-primary-6" />}
            title="Tài liệu tham khảo"
          >
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </Group>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {courses.length > 0 && (
            <Group
              icon={<GraduationCap size={15} className="text-primary-6" />}
              title="Khóa học CME"
              action={{ label: 'Tất cả', to: RouteConfig.CoursePage.path }}
            >
              {courses.map(course => (
                <RailCard
                  key={course.id}
                  to={RouteConfig.CourseDetailPage.path.replace(':id', course.id)}
                  thumbnail={course.thumbnail ?? undefined}
                  fallback={<GraduationCap size={22} className="text-primary-5" />}
                  title={course.title}
                  meta={
                    course.category?.name ??
                    (course.totalDurationMinutes
                      ? `${Math.round(course.totalDurationMinutes / 60)} giờ học`
                      : 'Khóa học')
                  }
                  price={formatPrice(course.price)}
                  free={course.price === 0}
                />
              ))}
            </Group>
          )}

          {documents.length > 0 && (
            <Group
              icon={<FileText size={15} className="text-primary-6" />}
              title="Tài liệu tham khảo"
              action={{ label: 'Tất cả', to: RouteConfig.LibraryPage.path }}
            >
              {documents.map(document => (
                <RailCard
                  key={document.id}
                  to={RoutePath.DocumentDetailPage.getPath(document.id)}
                  thumbnail={resolveDocThumbnail(document)}
                  fallback={<FileText size={22} className="text-primary-5" />}
                  title={document.title}
                  meta={document.category?.name ?? 'Tài liệu y khoa'}
                  price={formatPrice(document.price)}
                  free={document.price === 0}
                />
              ))}
            </Group>
          )}
        </div>
      )}
    </section>
  )
}
