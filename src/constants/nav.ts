import RouteConfig from '@/constants/RouteConfig'

// Single source of truth for the primary navigation shown in both the header
// nav bar (Header.tsx) and the footer "Danh mục" column (Footer.tsx). Keeping
// one list here prevents the footer from drifting out of sync when the nav
// changes. Icons stay in the header (footer needs none), so this holds plain
// data only — no JSX.
//
// why: import only the pure constants module `@/constants/RouteConfig` (no
// deps). Importing `@/routes` here would form an init-time cycle
// (@/routes → MainLayout → Footer → nav → @/routes) and read RoutePath before
// it is defined. The one path not in RouteConfig — "Thư viện" — is inlined as
// a literal; its canonical definition lives in routes/PublicRoute.tsx:10
// (PublicPath.DocumentListPage.path).
export interface PrimaryNavItem {
  path: string
  label: string
}

export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { path: RouteConfig.HomePage.path, label: 'Trang chủ' },
  { path: RouteConfig.ForumPage.path, label: 'Diễn đàn' },
  { path: RouteConfig.CoursePage.path, label: 'E-Learning' },
  { path: '/documents', label: 'Thư viện' }, // routes/PublicRoute.tsx:10
  { path: RouteConfig.JobListPage.path, label: 'Tuyển dụng' },
]
