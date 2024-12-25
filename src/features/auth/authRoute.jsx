import MainLayout from '../layout/layouts/MainLayout'
import Auth from './pages/Auth'
import Ranking from './pages/Ranking'
import RequireAuth from '~/components/RequireAuth'

const authRoutes = [
  // user auth routes
  {
    path: 'login',
    element: <Auth />
  },
  {
    path: 're-login',
    element: <Auth />
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: 'user',
        children: [
          {
            path: 'ranking',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <Ranking />
              </RequireAuth>
            )
          }
        ]
      }
    ]
  }
]
export default authRoutes
