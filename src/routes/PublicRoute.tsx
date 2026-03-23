import { DocumentDetailPage } from '@/pages/public/DocumentDetailPage/DocumentDetailPage'
import { DocumentListPage } from '@/pages/public/DocumentListPage/DocumentListPage'
import type { RouteObject } from 'react-router'

export const PublicPath = {
  DocumentListPage: {
    path: '/documents',
  },
  DocumentDetailPage: {
    path: '/document/:id',
    paramKey: {
      id: 'id',
    },
    getPath: (id: string) => `/document/${id}`,
  },
}

export const PublicRoute: RouteObject[] = [
  {
    path: PublicPath.DocumentListPage.path,
    element: <DocumentListPage />,
  },
  {
    path: PublicPath.DocumentDetailPage.path,
    element: <DocumentDetailPage />,
  },
]
