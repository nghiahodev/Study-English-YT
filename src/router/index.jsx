import { createBrowserRouter } from 'react-router-dom'

import NotFound from '~/components/NotFound'
import RequireAuth from '~/components/RequireAuth'
import MainLayout from '~/features/layout/layouts/MainLayout'

import authRoutes from '~/features/auth/authRoute'
import exerciseRoutes from '~/features/exercise/exerciseRoute'
import homeRoutes from '~/features/home/homeRoutes'
import statisticRoutes from '~/features/statistic/statisticRoute'

const router = createBrowserRouter([
  ...authRoutes,
  ...homeRoutes,
  ...exerciseRoutes,
  ...statisticRoutes,
  {
    element: (
      <RequireAuth allowedRoles={['admin', 'user']}>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: '/not-found',
        element: <NotFound />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

export default router
