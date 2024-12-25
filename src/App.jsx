import { useSelector } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import { CssBaseline, ThemeProvider } from '@mui/material'

import SocketProvider from './contexts/SocketProvider.jsx'

import getTheme from './config/theme'
import useAuth from './hooks/useAuth'
import router from './router'

function App() {
  const auth = useAuth()
  const theme = useSelector((state) => state.theme)
  const toastTheme = theme.mode === 'dark' ? 'dark' : 'light'
  return (
    <>
      <ThemeProvider theme={getTheme(theme.mode)}>
        <CssBaseline />
        <SocketProvider userId={auth.id}>
          <ToastContainer theme={toastTheme} />
          <RouterProvider router={router} />
        </SocketProvider>
      </ThemeProvider>
    </>
  )
}

export default App
