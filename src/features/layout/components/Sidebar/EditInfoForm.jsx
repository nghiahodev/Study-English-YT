import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Close, Info, PhotoCamera } from '@mui/icons-material'
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Stack
} from '@mui/material'

import FileField from '~/components/fields/FileField'
import TextField from '~/components/fields/TextField'

import customToast from '~/config/toast'
import authApi from '~/features/auth/authApi'

const EditInfoForm = ({ open = false, setOpen = () => {} }) => {
  const fileFieldRef = useRef(null)

  const [user, setUser] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  // Xử lý đóng Dialog
  const handleClose = () => {
    setOpen(false)
  }

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: '',
      avatar: null
    }
  })

  const onSubmit = async (data) => {
    const id = customToast.loading()
    const formData = new FormData()
    formData.append('name', data.name) // Thêm name vào FormData
    formData.append('picture', data.picture) // Thêm file picture vào FormData

    console.log([...formData.entries()])
    try {
      const response = await authApi.updateInfo(formData)
      customToast.update(id, 'Cập nhật thành công!')
    } catch (error) {
      console.log(error)
      customToast.update(id, 'Cập nhật thất bại!', 'error')
    }
  }

  const handleFileSelect = (file, fileURL) => {
    setAvatarPreview(fileURL) // Cập nhật ảnh xem trước
    setValue('picture', file)
  }
  const handleAvatarClick = () => {
    fileFieldRef.current.triggerFileInput() // Kích hoạt click trên input file
  }

  useEffect(() => {
    ;(async () => {
      try {
        const user = await authApi.getUser()
        setUser(user)
        reset({
          name: user?.name || '', // Nếu có user, thiết lập giá trị name
          email: user?.email || ''
        })
        setAvatarPreview(user?.picture)
        //
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  return (
    <Dialog open={open} aria-labelledby='confirm-dialog-title'>
      <DialogTitle id='confirm-dialog-title'></DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth>
            <FormLabel>Ảnh đại diện</FormLabel>
            <Stack
              justifyContent='center'
              direction='column'
              alignItems='center'
            >
              <Avatar
                src={avatarPreview}
                sx={{
                  width: 100,
                  height: 100,
                  cursor: 'pointer',
                  borderWidth: '2px', // Độ dày của viền
                  borderStyle: 'solid', // Kiểu viền
                  borderColor: 'primary.main', // Màu viền
                  borderRadius: '50%', // Đảm bảo avatar có dạng tròn
                  '&:hover': {
                    borderColor: 'secondary.main' // Thay đổi màu viền khi hover
                  }
                }}
                alt='User Avatar'
                onClick={handleAvatarClick}
              >
                <PhotoCamera sx={{ fontSize: 40 }} />
              </Avatar>
            </Stack>

            <FileField
              ref={fileFieldRef}
              name='picture'
              control={control}
              hidden
              onFileSelect={handleFileSelect}
            />
          </FormControl>

          <FormControl fullWidth margin='normal'>
            <FormLabel>Họ tên</FormLabel>
            <TextField
              name='name'
              control={control}
              rules={{
                required: 'Bạn không thể bỏ trống trường họ và tên'
              }}
            />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <FormLabel>Email</FormLabel>
            <TextField name='email' control={control} disabled />
          </FormControl>
          <Stack direction='row' gap={2} justifyContent='flex-end'>
            <FormControl margin='normal'>
              <Button variant='outlined' onClick={handleClose}>
                <Close />
              </Button>
            </FormControl>
            <FormControl margin='normal'>
              <Button
                style={{ textTransform: 'none' }}
                variant='contained'
                fullWidth
                type='submit'
              >
                Cập nhật
              </Button>
            </FormControl>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditInfoForm
