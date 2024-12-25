import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  ArrowBack,
  MailOutline,
  PersonOutline,
  Subtitles
} from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material'

import TextField from '~/components/fields/TextField'

const ForgetForm = ({ gobackToSignIn }) => {
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (data) => {
    console.log(data)
  }
  return (
    <Dialog maxWidth='xs' fullWidth open={true} aria-labelledby='auth dialog'>
      <DialogContent sx={{ py: 5 }}>
        <IconButton aria-label='go back' onClick={gobackToSignIn}>
          <ArrowBack color='action' />
        </IconButton>
        <Box
          onClick={() => navigate('/')}
          sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
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
        <Box p={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    <PersonOutline
                      color={errors.username ? 'error' : 'action'}
                    />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              name='email'
              control={control}
              rules={{
                required: 'Email is required' // Thông báo lỗi khi field này bị bỏ trống
              }}
              placeholder='Địa chỉ email đã dùng đăng ký tài khoản'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <MailOutline color={errors.username ? 'error' : 'action'} />
                  </InputAdornment>
                )
              }}
            />

            <FormControl margin='normal' fullWidth>
              <Button
                style={{ textTransform: 'none' }}
                size='large'
                variant='contained'
                color='primary'
                fullWidth
                type='submit'
              >
                Lấy lại mật khẩu
              </Button>
            </FormControl>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ForgetForm
