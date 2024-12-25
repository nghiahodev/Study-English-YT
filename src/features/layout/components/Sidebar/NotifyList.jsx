import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { NotificationsNone } from '@mui/icons-material'
import { Box, List, Popover, Stack, Typography } from '@mui/material'

import NotifyItem from './NotifyItem'

import customToast from '~/config/toast'
import notifyApi from '~/features/notify/notifyApi'
import useSocketListener from '~/hooks/useSocketListener'
import util from '~/utils'

const imageMapping = [
  {
    type: 'Exercise',
    getImage: (el) => el.relatedId?.thumbnails[3]?.url
  },
  {
    type: 'Comment',
    getImage: (el) =>
      el.relatedId.userId?.picture ||
      util.getRoboHashUrl(el.relatedId.userId?.id)
  }
]

const NotifyList = ({
  anchorEl,
  open,
  onClose,
  onNewNotifiesChange,
  userId
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [commentNotify, setCommentNotify] = useState(null)
  const [exerciseNotify, setExerciseNotify] = useState(null)
  useSocketListener(userId, 'comment', (data) => {
    setCommentNotify(data)
  })
  useSocketListener(userId, 'exercise', (data) => {
    setExerciseNotify(data)
  })

  const [newNotifies, setNewNotifies] = useState([])
  const [notifies, setNotifies] = useState([])
  const [deletingNotifyId, setDeletingNotifyId] = useState(null)

  const handleGetImage = (el) => {
    const mapping = imageMapping.find((item) => item.type === el.type)
    return mapping ? mapping.getImage(el) : null
  }
  const handleClick = (notify) => {
    if (notify.type === 'Comment') {
      const exerciseId = notify.relatedId.exerciseId
      const relatedId = notify.relatedId.id
      if (location.pathname.startsWith(`/exercise/play/${exerciseId}`))
        navigate(`/exercise/play/${exerciseId}/?commentId=${relatedId}`)
      else navigate(`/exercise/preview/${exerciseId}/?commentId=${relatedId}`)
    }

    if (notify.type === 'Exercise') {
      const exerciseId = notify.relatedId.id
      navigate(`/exercise/preview/${exerciseId}`)
    }

    if (notify.type === 'Word') {
      navigate(`/exercise/playlist?tab=1`)
    }
    if (!notify.seen) handleMarkAsRead(notify.id)

    onClose()
  }

  const handleDelete = async (id) => {
    try {
      // Đánh dấu thông báo đang bị xóa
      setDeletingNotifyId(id)

      // Đợi hiệu ứng xóa hoàn thành (ví dụ: 500ms)
      setTimeout(async () => {
        const deleteNotify = await notifyApi.deleteNotify(id)
        setNotifies((prev) =>
          prev.filter((notify) => notify.id !== deleteNotify.id)
        )
        customToast.success('Bạn đã xóa 1 thông báo!')
        setDeletingNotifyId(null) // Xóa đánh dấu sau khi hoàn thành
      }, 500) // Thời gian tương ứng với hiệu ứng
    } catch (error) {
      console.log(error)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      const updatedNotify = await notifyApi.updateNotify(id, { seen: true })
      setNotifies((prev) =>
        prev.map((notify) =>
          notify.id === updatedNotify.id
            ? { ...notify, seen: true } // Cập nhật chỉ thuộc tính `seen`
            : notify
        )
      )
      const updatedNewNotifies = newNotifies.filter(
        (el) => el.id !== updatedNotify.id
      )
      setNewNotifies(updatedNewNotifies)
      onNewNotifiesChange(updatedNewNotifies)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (commentNotify) {
      setNotifies((prev) => [commentNotify, ...prev])
      const updatedNewNotifies = [
        ...notifies.filter((el) => !el.seen),
        commentNotify
      ]
      onNewNotifiesChange(updatedNewNotifies)
    }
  }, [commentNotify])

  useEffect(() => {
    if (exerciseNotify) {
      setNotifies((prev) => [exerciseNotify, ...prev])
      const updatedNewNotifies = [
        ...notifies.filter((el) => !el.seen),
        exerciseNotify
      ]
      onNewNotifiesChange(updatedNewNotifies)
    }
  }, [exerciseNotify])

  useEffect(() => {
    ;(async () => {
      try {
        const notifies = await notifyApi.getUserNotifies()
        setNotifies(notifies)
        const newNotifies = notifies.filter((el) => !el.seen)
        setNewNotifies(newNotifies)
        onNewNotifiesChange(newNotifies)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      <Box
        sx={{
          width: 500,
          minHeight: 500,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            borderBottom: '2px solid #000'
          }}
        >
          Thông báo
        </Typography>
        <Stack direction='row' justifyContent='space-between' py={1}>
          <Typography variant='subtitle2'>
            Chưa xem: {newNotifies.length}
          </Typography>
          <Typography variant='subtitle2'>Tổng: {notifies.length}</Typography>
        </Stack>
        {notifies.length > 0 ? (
          <List>
            {notifies.map((el, index) => {
              const isDeleting = el.id === deletingNotifyId
              let subText = ''
              if (el.type === 'Comment') subText = el.relatedId?.content
              if (el.type === 'Exercise') subText = el.relatedId?.title
              return (
                <Box
                  key={index}
                  sx={{
                    opacity: isDeleting ? 0 : 1,
                    transform: isDeleting ? 'translateX(-20px)' : 'none',
                    transition: 'opacity 0.5s ease, transform 0.5s ease'
                  }}
                  onClick={() => handleClick(el)}
                >
                  <NotifyItem
                    message={el.message}
                    seen={el.seen}
                    image={handleGetImage(el)}
                    type={el.type}
                    time={el.createdAt}
                    onMarkAsRead={() => handleMarkAsRead(el.id)}
                    onDelele={() => handleDelete(el.id)}
                    subText={subText}
                  />
                </Box>
              )
            })}
          </List>
        ) : (
          <Stack direction='column' flexGrow={1} justifyContent='center'>
            <Typography variant='body2' sx={{ textAlign: 'center' }}>
              Không có thông báo
            </Typography>
            <Stack direction='row' justifyContent='center'>
              <NotificationsNone sx={{ fontSize: 50 }} />
            </Stack>
          </Stack>
        )}
      </Box>
    </Popover>
  )
}

export default NotifyList
