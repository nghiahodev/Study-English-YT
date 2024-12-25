import { cloneElement } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'

const Navigation = ({ openSidebar, icon, text, path = '' }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const isMatch = location.pathname === path.split('?')[0]

  const handleClick = () => {
    if (!isMatch) navigate(path)
  }
  return (
    <ListItem disablePadding sx={{ display: 'block' }} onClick={handleClick}>
      <ListItemButton
        sx={{
          minHeight: 60,
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
          {cloneElement(icon, {
            sx: {
              color: isMatch ? 'primary.main' : ''
            }
          })}
        </ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{ fontSize: '14px' }}
          sx={{ opacity: openSidebar ? 1 : 0 }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default Navigation
