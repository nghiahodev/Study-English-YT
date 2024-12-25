import { useEffect, useState } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material'

import util from '~/utils'

const ConfirmDialog = ({
  open = false,
  content = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  onConfirm = () => {},
  onClose = () => {},
  icon = <></>
}) => {
  const [openDialog, setOpenDialog] = useState(false)
  const handleClose = () => {
    onClose()
    setOpenDialog(false)
  }
  const handleConfirm = () => {
    setOpenDialog(false)
    onConfirm() // Call the onClose function if provided
  }

  useEffect(() => {
    setOpenDialog(open)
  }, [open])
  return (
    <Dialog
      open={openDialog}
      onClose={onClose}
      aria-labelledby='confirm-dialog-title'
    >
      <DialogTitle id='confirm-dialog-title'>
        <Stack justifyContent='center' direction='row'>
          {icon}
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ maxWidth: '600px', minWidth: '400px' }}>
        <Typography
          textAlign='center'
          sx={{
            whiteSpace: 'pre-line' // Hỗ trợ ngắt dòng qua ký tự \n
          }}
        >
          {content}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ py: 2 }}>
        <Button onClick={handleClose} variant='outlined'>
          Đóng
        </Button>
        {!util.isEmptyFunction(onConfirm) && (
          <Button onClick={handleConfirm} variant='contained'>
            Xác nhận
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
