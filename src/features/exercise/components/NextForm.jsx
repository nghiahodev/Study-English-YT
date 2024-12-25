import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Close, Info } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormLabel,
  Stack,
  Typography
} from '@mui/material'
import _ from 'lodash'

import Segment from './Segment'
import TextField from '~/components/fields/TextField'

import customToast from '~/config/toast'

const NextForm = ({
  open,
  setOpen,
  selectedSegment,
  resultSegment,
  onNext = () => {}
}) => {
  const { control, handleSubmit, reset } = useForm()
  // form này chỉ hiện lên khi sai, nên nếu null xảy ra thì chứng tỏ là sai hết
  let failWords = resultSegment?.dictationWords
    ?.filter((el) => el.isCorrected === false) // Lọc những đối tượng có isCorrected === false
    ?.map((el) => el.word) // Trích xuất thuộc tính word
  if (_.isEmpty(failWords)) failWords = resultSegment.dictationWords

  const inputRef = useRef(null)
  const onSubmit = async (data) => {
    const inputWords = data.repairWords
      .replace(/[^a-zA-Z0-9 ]/g, '') // Bước 1: Loại bỏ ký tự đặc biệt
      .replace(/\s+/g, ' ') // Bước 2: Thay thế nhiều dấu cách bằng một dấu cách
      .trim()
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length > 0)

    const isMatch = failWords.every((word) => inputWords.includes(word))
    if (isMatch) {
      onNext()
      reset({ repairWords: '' })
      customToast.success('Chuyển câu thành công!')
    } else customToast.error('Bạn chữa lỗi chưa đúng!')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Ngăn hành vi mặc định (xuống dòng mới khi nhấn Enter)
      e.preventDefault()
      handleSubmit(onSubmit)()
    }
  }

  useEffect(() => {
    if (open) {
      // Trì hoãn việc focus để đảm bảo inputRef đã có giá trị
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 0) // Đặt thời gian là 0 để thực thi ngay khi có thể (sau khi render)
    }
  }, [open])

  return (
    <Dialog maxWidth='sm' fullWidth open={open} aria-labelledby='auth dialog'>
      <Box mt={2} px={3}>
        <Segment isDictation={true} isCheck={true} segment={resultSegment} />
      </Box>
      <Typography px={5} mt={2} variant='body2'>
        {selectedSegment.transText}
      </Typography>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormLabel>Chữa lỗi</FormLabel>
          <TextField
            onKeyDown={handleKeyPress}
            name='repairWords'
            placeholder='Nhập lại từ đã sai để tiếp tục'
            control={control}
            rules={{
              required: 'Nội dung nhập lại là bắt buộc!'
            }}
            multiline
            minRows={2}
            inputRef={inputRef}
          />
          <Stack direction='row' gap={2} justifyContent='flex-end'>
            <FormControl margin='normal'>
              <Button variant='outlined' onClick={() => setOpen(false)}>
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
                Xác nhận để chuyển câu
              </Button>
            </FormControl>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NextForm
