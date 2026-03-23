import { DocumentDetailPage } from '@/pages/public/DocumentDetailPage/DocumentDetailPage'
import { DocumentListPage } from '@/pages/public/DocumentListPage/DocumentListPage'
import { DocumentOrderCancelPage } from '@/pages/public/DocumentOrderPage/DocumentOrderCancelPage'
import { DocumentOrderErrorPage } from '@/pages/public/DocumentOrderPage/DocumentOrderErrorPage'
import { DocumentOrderSuccessPage } from '@/pages/public/DocumentOrderPage/DocumentOrderSuccessPage'
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

  DocumentOrderSuccessPage: {
    path: '/document-order/success',
  },
  DocumentOrderCancelPage: {
    path: '/document-order/cancel',
  },
  DocumentOrderErrorPage: {
    path: '/document-order/error',
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
  {
    path: PublicPath.DocumentOrderSuccessPage.path,
    element: <DocumentOrderSuccessPage />,
  },
  {
    path: PublicPath.DocumentOrderCancelPage.path,
    element: <DocumentOrderCancelPage />,
  },
  {
    path: PublicPath.DocumentOrderErrorPage.path,
    element: <DocumentOrderErrorPage />,
  },
]
