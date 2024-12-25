import React, { useState } from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'

import util from '~/utils'

const LockUserForm = ({ open, onClose, onSubmit, user }) => {
  const [lockDuration, setLockDuration] = useState('') // Mặc định là 3 ngày
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const handleClose = () => {
    setLockDuration('') // Reset về mặc định 3 ngày
    setReason('')
    setError('')
    onClose()
  }
  const handleSubmit = () => {
    if (!lockDuration || !reason) {
      setError('Vui lòng chọn thời gian và lý do khóa tài khoản.')
      return
    }
    onSubmit({ userId: user.id, lockDuration, reason })
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Khóa tài khoản</DialogTitle>
      <DialogContent
        sx={{
          minWidth: '500px'
        }}
      >
        {/* Thông tin user */}
        {user && (
          <Box>
            <Typography>Tên người dùng: {user.name}</Typography>
            <Typography>
              Ngày tạo: {util.getTimeSince(user.createdAt)}
            </Typography>
          </Box>
        )}

        {/* Chọn thời gian khóa */}
        <FormControl fullWidth margin='normal' error={!!error}>
          <InputLabel sx={{ fontSize: '14px' }}>Thời gian khóa</InputLabel>
          <Select
            value={lockDuration}
            onChange={(e) => setLockDuration(e.target.value)}
            label='Thời gian khóa'
            sx={{ fontSize: '14px' }} // Đặt cỡ chữ cho Select
          >
            <MenuItem value='' sx={{ fontSize: '14px' }}>
              -- Chọn thời gian khóa --
            </MenuItem>
            <MenuItem value={3} sx={{ fontSize: '14px' }}>
              3 ngày
            </MenuItem>
            <MenuItem value={7} sx={{ fontSize: '14px' }}>
              7 ngày
            </MenuItem>
            <MenuItem value={30} sx={{ fontSize: '14px' }}>
              1 tháng
            </MenuItem>
          </Select>
        </FormControl>

        {/* Chọn lý do khóa */}
        <FormControl fullWidth margin='normal' error={!!error}>
          <InputLabel sx={{ fontSize: '14px' }}>Lý do khóa</InputLabel>
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            label='Lý do khóa'
            sx={{ fontSize: '14px' }} // Đặt cỡ chữ cho Select
          >
            <MenuItem value='' sx={{ fontSize: '14px' }}>
              -- Chọn lý do khóa --
            </MenuItem>
            <MenuItem
              value='Vi phạm điều khoản sử dụng'
              sx={{ fontSize: '14px' }}
            >
              Vi phạm điều khoản sử dụng
            </MenuItem>
            <MenuItem
              value='Spam hoặc lạm dụng hệ thống'
              sx={{ fontSize: '14px' }}
            >
              Spam hoặc lạm dụng hệ thống
            </MenuItem>
            <MenuItem value='Hành vi không phù hợp' sx={{ fontSize: '14px' }}>
              Hành vi không phù hợp
            </MenuItem>
          </Select>
          <FormHelperText sx={{ fontSize: '12px' }}>{error}</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions
        sx={{
          padding: '16px' // Tăng padding cho khu vực nút
        }}
      >
        <Button
          variant='outlined'
          onClick={handleClose}
          sx={{ fontSize: '14px' }}
        >
          Đóng
        </Button>
        <Button
          variant='contained'
          onClick={handleSubmit}
          sx={{ fontSize: '14px' }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LockUserForm
