import MainLayout from '../layout/layouts/MainLayout'
import AdminListExercises from './pages/AdminListExercise'
import CreateExercise from './pages/CreateExercise'
import ListExercises from './pages/ListExercises'
import PlayExercise from './pages/PlayExercise'
import PlayListExercise from './pages/PlayListExercise'
import PreviewExercise from './pages/PreviewExercise'
import RequireAuth from '~/components/RequireAuth'

const exerciseRoutes = [
  // admin home routes
  {
    element: <MainLayout />,
    children: [
      {
        path: 'exercise',
        children: [
          {
            path: 'admin/create',
            element: (
              <RequireAuth allowedRoles={['admin']}>
                <CreateExercise />
              </RequireAuth>
            )
          },
          {
            path: 'admin/list',
            element: (
              <RequireAuth allowedRoles={['admin']}>
                <AdminListExercises />
              </RequireAuth>
            )
          },
          {
            path: 'preview/:id',
            element: (
              <RequireAuth allowedRoles={['admin', 'user']}>
                <PreviewExercise />
              </RequireAuth>
            )
          },
          {
            path: 'list',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <ListExercises />
              </RequireAuth>
            )
          },
          {
            path: 'create',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <CreateExercise />
              </RequireAuth>
            )
          },
          {
            path: 'playlist',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <PlayListExercise />
              </RequireAuth>
            )
          },
          {
            path: 'play/:id',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <PlayExercise />
              </RequireAuth>
            )
          }
        ]
      }
    ]
  }
]

export default exerciseRoutes
