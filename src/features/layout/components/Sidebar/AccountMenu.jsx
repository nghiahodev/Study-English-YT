import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DarkMode, ExitToApp, Help, Info, LightMode } from '@mui/icons-material'
import { Box, ListItemIcon, Menu, MenuItem } from '@mui/material'

import EditInfoForm from './EditInfoForm'

import { toggleDarkMode } from '~/features/layout/slices/themeSlice'

const AccountMenu = ({ anchorEl, open, onClose, onLogout }) => {
  const theme = useSelector((state) => state.theme)
  const dispatch = useDispatch()

  const [openForm, setOpenForm] = useState(false)

  const handleOpenForm = () => {
    setOpenForm(true)
  }

  const handleToggle = () => {
    dispatch(toggleDarkMode())
  }
  return (
    <Box>
      {/* Các dialog phải đặt bên ngoài element mang thuộc tính click để kích hoạt nó */}
      {/* Dialog */}
      <EditInfoForm open={openForm} setOpen={setOpenForm} />
      {/* End Dialog */}

      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={onClose}
        onClick={onClose}
        sx={{ py: 0 }}
        MenuListProps={{
          sx: { py: 0 } // Điều chỉnh padding cho MenuList
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mb: 1.5,
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
              bottom: 0,
              left: 10,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem onClick={handleOpenForm} sx={{ typography: 'body2' }}>
          <ListItemIcon>
            <Info fontSize='small' />
          </ListItemIcon>
          Chỉnh sửa thông tin cá nhân
        </MenuItem>
        <MenuItem onClick={handleToggle} sx={{ typography: 'body2' }}>
          {theme.mode === 'light' ? (
            <>
              <ListItemIcon>
                <DarkMode fontSize='small' />
              </ListItemIcon>
              Bật chế độ tối
            </>
          ) : (
            <>
              <ListItemIcon>
                <LightMode fontSize='small' />
              </ListItemIcon>
              Bật chế độ sáng
            </>
          )}
        </MenuItem>
        <MenuItem onClick={onLogout} sx={{ typography: 'body2' }}>
          <ListItemIcon>
            <ExitToApp fontSize='small' />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default AccountMenu
