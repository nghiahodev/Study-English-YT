import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { InfoOutlined, MailOutline } from '@mui/icons-material'
import LockIcon from '@mui/icons-material/LockOpen'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import ShownPasswordIcon from '@mui/icons-material/VisibilityOffOutlined'
import HiddenPasswordIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment
} from '@mui/material'

import TextField from '~/components/fields/TextField'

import authApi from '../authApi'
import customToast from '~/config/toast'

const SignupForm = ({ gobackToSignIn }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({})

  const [showPassword, setShowPassword] = React.useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }
  const onSubmit = async (data) => {
    const id = customToast.loading()
    try {
      await authApi.register(data)
      customToast.stop(id)
      customToast.success('Đăng ký thành công')
      gobackToSignIn()
    } catch (error) {
      console.log(error)
      customToast.update(id, error.data.message, 'error')
    }
  }
  return (
    <Box p={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          name='name'
          control={control}
          rules={{
            required: 'Name is required' // Thông báo lỗi khi field này bị bỏ trống
          }}
          placeholder='Tên người dùng'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <InfoOutlined color={errors.username ? 'error' : 'action'} />
              </InputAdornment>
            )
          }}
        />
        <TextField
          name='username'
          control={control}
          rules={{
            required: 'Username is required' // Thông báo lỗi khi field này bị bỏ trống
          }}
          placeholder='Tên đăng nhập'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <PersonOutlineIcon
                  color={errors.username ? 'error' : 'action'}
                />
              </InputAdornment>
            )
          }}
        />
        <TextField
          name='password'
          control={control}
          rules={{
            required: 'Password is required' // Thông báo lỗi khi field này bị bỏ trống
          }}
          placeholder='Mật khẩu'
          type={!showPassword ? 'password' : 'text'}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <LockIcon color={errors.password ? 'error' : 'action'} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password'
                  onClick={togglePassword}
                >
                  {React.createElement(
                    !showPassword ? ShownPasswordIcon : HiddenPasswordIcon,
                    {
                      color: errors.password ? 'error' : 'action'
                    }
                  )}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {/* <TextField
          name='email'
          control={control}
          rules={{
            required: 'Email is required' // Thông báo lỗi khi field này bị bỏ trống
          }}
          placeholder='Địa chỉ email'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <MailOutline color={errors.username ? 'error' : 'action'} />
              </InputAdornment>
            )
          }}
        /> */}

        <FormControl margin='normal' fullWidth>
          <Button
            style={{ textTransform: 'none' }}
            size='large'
            variant='contained'
            color='primary'
            fullWidth
            type='submit'
          >
            Đăng ký tài khoản
          </Button>
        </FormControl>
      </form>
    </Box>
  )
}
export default SignupForm
