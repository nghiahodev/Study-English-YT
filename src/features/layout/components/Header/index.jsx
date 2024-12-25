import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { LoginOutlined, PersonAdd, Settings } from '@mui/icons-material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import SubtitlesIcon from '@mui/icons-material/Subtitles'
import { Avatar, Button, Divider, ListItemIcon, Tooltip } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import SearchInput from './Search'
import { toggleSidebar } from '~/features/layout/components/Sidebar/sidebarSlice'

import useAuth from '~/hooks/useAuth'

const HeaderLayout = () => {
  const auth = useSelector((state) => state.auth)
  const userRole = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id='account-menu'
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1
          },
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0
          }
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={handleClose}>
        <Avatar /> Profile
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <Avatar /> My account
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <PersonAdd fontSize='small' />
        </ListItemIcon>
        Add another account
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <Settings fontSize='small' />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <LoginOutlined fontSize='small' />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )

  return (
    <AppBar
      sx={{
        position: 'sticky',
        top: 0,
        height: 56,
        px: 2,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#fff',
        color: (theme) => theme.palette.primary
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          '@media (min-width:600px)': {
            minHeight: (theme) => theme.app.headerHeight, // Ghi đè min-height cho màn hình >= 600px
            padding: 0,
            width: '100%'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size='large'
            color='inherit'
            aria-label='open drawer'
            sx={{ p: 1 }}
            onClick={() => dispatch(toggleSidebar())}
          >
            <MenuIcon />
          </IconButton>
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <SubtitlesIcon sx={{ fontSize: 30, color: '#ff0000' }} />

            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight: 'bold'
              }}
            >
              YTSub
            </Typography>
          </Box>
        </Box>
        <SearchInput />
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton
            size='large'
            aria-label='show 17 new notifications'
            color='inherit'
          >
            <Badge badgeContent={17} color='error'>
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <Tooltip title='Account settings'>
            <Button
              onClick={handleClick}
              size='small'
              sx={{
                ml: 2,
                textTransform: 'none',
                '&:hover': { background: 'transparent' }
              }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              endIcon={<KeyboardArrowDownIcon />}
            >
              <Typography>{auth.user?.username}</Typography>
            </Button>
          </Tooltip>
        </Box>
        {renderMenu}
      </Toolbar>
    </AppBar>
  )
}

export default HeaderLayout
