import React, { memo, useState } from 'react'

import { VolumeUp } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  Menu,
  Slider,
  Stack,
  Typography
} from '@mui/material'

const Volume = memo(({ setVolume }) => {
  const [value, setValue] = useState(100)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleChange = (event, newValue) => {
    setValue(newValue)
    // Chỉ cập nhật giá trị của slider
  }

  // Hàm xử lý khi người dùng thả slider
  const handleChangeCommitted = (event, newValue) => {
    setVolume(newValue) // Gọi handleVolume khi thả chuột
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id='account-menu'
      open={open}
      onClose={handleClose}
      transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <Stack direction='row' alignItems='center'>
        <Slider
          value={value}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted} // Gọi handleVolume khi thả chuột
          aria-label='Volume'
          sx={{ width: '100px', ml: 3, my: 2 }}
          className='volume-slider'
          step={5}
          min={0}
          max={100}
        />
        <Typography variant='body1' sx={{ textAlign: 'center', width: '60px' }}>
          {value}
        </Typography>
      </Stack>
    </Menu>
  )

  // Hàm xử lý thay đổi giá trị slider

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
      >
        <VolumeUp />
      </IconButton>
      {renderMenu}
    </Box>
  )
})

export default Volume
