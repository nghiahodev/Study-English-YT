import { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Close } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Stack,
  Typography
} from '@mui/material'
import _ from 'lodash'

import TextField from '~/components/fields/TextField'

import authApi from '~/features/auth/authApi'
import commentApi from '~/features/comment/commentApi'
import util from '~/utils'

const CommentForm = ({
  exerciseId,
  reply,
  setReply,
  parentId = null,
  subReply = false,
  replyName = null,
  setIsShowReplies,
  onCreate,
  firstLevel,
  role
}) => {
  const [user, setUser] = useState({})
  const [open, setOpen] = useState(false)
  const [notifyAdmin, setNotifyAdmin] = useState(false)
  const inputRef = useRef()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { content: '' }
  })
  // Hàm xử lý khi gửi comment
  const onSubmit = async (data) => {
    data.parentId = parentId
    data.exerciseId = exerciseId
    data.notifyAdmin = notifyAdmin
    try {
      const newComment = await commentApi.createComment(data)
      if (reply) {
        setReply(false)
        setIsShowReplies(true)
        setNotifyAdmin(false)
      }
      setOpen(false)
      reset()
      onCreate(newComment)
    } catch (error) {}
  }

  useEffect(() => {
    ;(async () => {
      await authApi.getUser().then((user) => setUser(user))
    })()
    if (inputRef.current && reply) {
      inputRef.current.focus() // Tự động focus vào TextField
    }
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={() => setOpen(true)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Box>
            <Avatar
              name={user.name}
              src={user.picture || util.getRoboHashUrl(user.id)}
            />
          </Box>

          {/* Sử dụng Controller để kết nối TextField với React Hook Form */}
          <TextField
            name='content'
            placeholder='Thêm một bình luận...'
            control={control}
            rules={{
              required: 'Nội dùng comment là bắt buộc'
            }}
            variant='standard'
            multiline
            inputRef={inputRef}
            InputProps={{
              sx: { fontSize: '14px' },
              startAdornment: subReply ? (
                <InputAdornment position='start'>
                  <Typography
                    variant='span'
                    fontWeight={'bold'}
                    color={'secondary.main'}
                  >
                    @{replyName}
                  </Typography>
                </InputAdornment>
              ) : null
            }}
          />
        </Stack>

        {(open || reply) && (
          <Stack direction='row' spacing={2} justifyContent='flex-end'>
            {/* Kiểm tra firstLevel, chỉ hiển thị checkbox nếu firstLevel là true */}
            {firstLevel && role !== 'admin' && (
              <FormControl margin='normal'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notifyAdmin}
                      onChange={() => setNotifyAdmin(!notifyAdmin)} // Cập nhật giá trị khi thay đổi
                    />
                  }
                  label='Thông báo cho admin nếu cần thiết'
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: 14 // Thay đổi font-size ở đây
                    }
                  }}
                />
              </FormControl>
            )}
            <FormControl margin='normal'>
              <Button
                variant='outlined'
                onClick={() => {
                  setOpen(false)
                  if (reply) setReply(false)
                  reset()
                }}
              >
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
                {reply ? 'Trả lời' : 'Bình luận'}
              </Button>
            </FormControl>
          </Stack>
        )}
      </Box>
    </form>
  )
}

export default CommentForm
