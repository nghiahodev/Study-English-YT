import AdminStatistic from './pages/AdminStatistic'
import UserStatistic from './pages/UserStatistic'
import RequireAuth from '~/components/RequireAuth'
import MainLayout from '~/features/layout/layouts/MainLayout'

const statisticRoutes = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/statistic/admin',
        element: (
          <RequireAuth allowedRoles={['admin']}>
            <AdminStatistic />
          </RequireAuth>
        )
      }
    ]
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: '/statistic',
        element: (
          <RequireAuth allowedRoles={['user']}>
            <UserStatistic />
          </RequireAuth>
        )
      }
    ]
  }
]
export default statisticRoutes
