import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import styled from '@emotion/styled'
import {
  NotificationsActive,
  NotificationsNone,
  TrendingUp
} from '@mui/icons-material'
import {
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'

import AccountMenu from './AccountMenu'
import NotifyList from './NotifyList'

import customToast from '~/config/toast'
import authApi from '~/features/auth/authApi'
import { logout } from '~/features/auth/slices/authSlice'
import {
  addLevelWords,
  resetLevelWords
} from '~/features/auth/slices/levelSlice'
import statisticApi from '~/features/statistic/statisticApi'
import usePrevious from '~/hooks/usePrevious'
import util from '~/utils'

const ShakyBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'shake' && prop !== 'invisibled'
})(({ shake }) => ({
  animation: shake ? 'shake 0.5s ease infinite' : 'none',
  '@keyframes shake': {
    '0%': {
      transform: 'rotate(0deg)'
    },
    '25%': {
      transform: 'rotate(10deg)'
    },
    '50%': {
      transform: 'rotate(0deg)'
    },
    '75%': {
      transform: 'rotate(-10deg)'
    },
    '100%': {
      transform: 'rotate(0deg)'
    }
  }
}))

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: 8, // Điều chỉnh kích thước Badge nhỏ hơn
    height: 8,
    borderRadius: '50%',
    position: 'absolute', // Đảm bảo vị trí tuyệt đối
    top: 0, // Căn chỉnh đúng vị trí
    right: 0,
    transform: 'translate(50%, -50%)', // Căn chỉnh ở góc trên bên phải
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      // animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))

const Account = ({ openSidebar }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const level = useSelector((state) => state.level)
  const previousWordsLength = usePrevious(level.words.length)

  const [anchorEl, setAnchorEl] = useState(null)
  const [user, setUser] = useState({})
  const [highlight, setHighlight] = useState(false)
  const [notifyAnchorEl, setNotifyAnchorEl] = useState(null)
  const [newNotifies, setNewNotifies] = useState([])
  const [notifyExpired, setNotifyExpired] = useState(null)
  const open = Boolean(anchorEl)

  // handle notify
  const handleNewNotifiesChange = (newNotifies) => {
    setNewNotifies(newNotifies)
  }

  //
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  //
  const handleLogout = () => {
    dispatch(resetLevelWords())
    dispatch(logout())
    handleClose
    navigate('/')
    customToast.success('Bạn đã đăng xuất thành công!')
  }

  // Mở popup danh sách thông báo
  const handleNotifyClick = (event) => {
    setNotifyAnchorEl(event.currentTarget)
  }

  // Đóng popup danh sách thông báo
  const handleNotifyClose = () => {
    setNotifyAnchorEl(null)
  }

  const isNotifyOpen = Boolean(notifyAnchorEl)

  // useEffect
  useEffect(() => {
    if (level.words.length > (previousWordsLength || 0)) {
      setHighlight(true)
      setTimeout(() => setHighlight(false), 500) // Hiệu ứng kéo dài 500ms
    }
  }, [level.words.length, previousWordsLength])

  useEffect(() => {
    ;(async () => {
      try {
        const user = await authApi.getUser()
        setUser(user)
        //
        if (user.role === 'user' && level.words.length === 0) {
          const { levelWords, notifyExpired } =
            await statisticApi.createNewDay()
          setNotifyExpired(notifyExpired || {})

          dispatch(addLevelWords(levelWords))
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  return (
    <>
      {/* Dialog */}

      {/* Item */}
      <List sx={{ p: 0 }}>
        {/* Notification */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              px: 2.5
            }}
            onClick={handleNotifyClick}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: openSidebar ? 2 : 'auto',
                justifyContent: 'center'
              }}
            >
              <ShakyBadge
                color='secondary'
                badgeContent={newNotifies.length}
                shake={newNotifies.length > 0}
                sx={{
                  '& .MuiBadge-badge': {
                    color: '#fff' // Màu chữ trắng
                  }
                }}
              >
                {newNotifies.length > 0 ? (
                  <NotificationsActive sx={{ color: 'primary.main' }} />
                ) : (
                  <NotificationsNone />
                )}
              </ShakyBadge>
            </ListItemIcon>
            <ListItemText
              primary='Thông báo'
              primaryTypographyProps={{
                fontSize: '14px',
                overflow: 'hidden', // Ẩn nội dung tràn
                whiteSpace: 'nowrap', // Ngăn ngắt dòng
                textOverflow: 'ellipsis' // Hiển thị dấu "..."
              }}
              sx={{
                opacity: openSidebar ? 1 : 0
              }}
            />
          </ListItemButton>
          {user.id && notifyExpired !== null && (
            <NotifyList
              anchorEl={notifyAnchorEl}
              open={isNotifyOpen}
              onClose={handleNotifyClose}
              onNewNotifiesChange={handleNewNotifiesChange}
              userId={user.id}
            />
          )}
        </ListItem>

        {/* Account */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              px: 2.5
            }}
            onClick={handleClick}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: openSidebar ? 2 : 'auto',
                justifyContent: 'center'
              }}
            >
              <StyledBadge
                overlap='circular'
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                variant='dot'
              >
                <Avatar
                  name={user.name}
                  src={user.picture || util.getRoboHashUrl(user.id)}
                  sx={{ width: '24px', height: '24px' }}
                />
              </StyledBadge>
            </ListItemIcon>
            <ListItemText
              primary={user.name}
              primaryTypographyProps={{
                fontSize: '14px',
                overflow: 'hidden', // Ẩn nội dung tràn
                whiteSpace: 'nowrap', // Ngăn ngắt dòng
                textOverflow: 'ellipsis' // Hiển thị dấu "..."
              }}
              sx={{
                opacity: openSidebar ? 1 : 0
              }}
            />
          </ListItemButton>
          <AccountMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onLogout={handleLogout}
          />
        </ListItem>

        {/* Level */}
        {user.role === 'user' && (
          <ListItem disablePadding sx={{ display: 'block' }}>
            {openSidebar ? (
              <ListItemButton
                sx={{
                  minHeight: 48,
                  px: 2.5
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: openSidebar ? 2 : 'auto',
                    justifyContent: 'center'
                  }}
                >
                  <TrendingUp
                    sx={{ color: 'primary.main', fontSize: '24px' }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant='body2'
                      sx={{
                        transition: 'transform 0.5s',
                        transform: highlight ? 'scale(1.2)' : 'scale(1)'
                      }}
                    >
                      {openSidebar && (
                        <Typography variant='span'>Level: </Typography>
                      )}{' '}
                      <Typography
                        variant='span'
                        fontWeight='bold'
                        color='primary.main'
                      >
                        {level.words.length}
                      </Typography>
                    </Typography>
                  }
                  primaryTypographyProps={{
                    fontSize: '14px',
                    overflow: 'hidden', // Ẩn nội dung tràn
                    whiteSpace: 'nowrap', // Ngăn ngắt dòng
                    textOverflow: 'ellipsis' // Hiển thị dấu "..."
                  }}
                  sx={{
                    opacity: openSidebar ? 1 : 0
                  }}
                />
              </ListItemButton>
            ) : (
              <ListItemButton
                sx={{
                  minHeight: 48,
                  p: 0,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  variant='body2'
                  sx={{
                    color: 'primary.main',
                    fontWeight: '700',
                    transition: 'transform 0.5s',
                    transform: highlight ? 'scale(1.5)' : 'scale(1)'
                  }}
                >
                  {level.words.length}
                </Typography>
              </ListItemButton>
            )}
          </ListItem>
        )}
      </List>
    </>
  )
}

export default Account
