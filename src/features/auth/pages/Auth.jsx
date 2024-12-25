import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Dialog,
  DialogContent,
  Tab,
  Tabs,
  Typography
} from '@mui/material'

import ForgetForm from '../components/ForgetForm'
import AdminLoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'

import useAuth from '~/hooks/useAuth'

const Auth = () => {
  const navigate = useNavigate()
  const [authIndex, setAuthIndex] = React.useState(0)
  const auth = useAuth()
  console.log(auth)

  const tabChange = (event, tabValue) => {
    event.preventDefault()
    setAuthIndex(tabValue)
  }
  const goToForget = () => {
    setAuthIndex(2)
  }
  const goToSignUp = () => {
    setAuthIndex(1)
  }
  const gobackToSignIn = () => {
    setAuthIndex(0)
  }
  React.useEffect(() => {
    if (auth.token === null) return

    if (auth.role === 'admin') {
      navigate('/statistic/admin')
    } else navigate('/exercise/playlist')
  }, [])
  if (authIndex === 2) return <ForgetForm {...{ gobackToSignIn }} />
  return (
    <Dialog maxWidth='xs' fullWidth open={true} aria-labelledby='auth dialog'>
      <DialogContent sx={{ py: 5 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 'bold'
            }}
          >
            HỌC TIẾNG ANH QUA VIDEO YOUTUBE
          </Typography>
        </Box>
        <Tabs
          variant='fullWidth'
          value={authIndex}
          centered
          onChange={tabChange}
          aria-label='auth tabs'
        >
          <Tab label='Đăng nhập' tabIndex={0} />
          <Tab label='Đăng ký' tabIndex={1} />
        </Tabs>
        {(() => {
          switch (authIndex) {
            case 0:
              return <AdminLoginForm {...{ goToForget, goToSignUp }} />
            case 1:
              return <SignupForm {...{ gobackToSignIn }} />
            default:
              return null
          }
        })()}
      </DialogContent>
    </Dialog>
  )
}
export default Auth
