import React, { memo, useState } from 'react'

import { SlowMotionVideo } from '@mui/icons-material'
import {
  Box,
  IconButton,
  Menu,
  Slider,
  Stack,
  Typography
} from '@mui/material'

const PlayRate = memo(({ setPlayRate }) => {
  const [value, setValue] = useState(1)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Hàm xử lý thay đổi giá trị slider
  const handleChange = (event, newValue) => {
    setValue(newValue)
    // Chỉ cập nhật giá trị của slider
  }

  // Hàm xử lý khi người dùng thả slider
  const handleChangeCommitted = (event, newValue) => {
    setPlayRate(newValue) // Gọi handleVolume khi thả chuột
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
          onChangeCommitted={handleChangeCommitted}
          aria-label='play-rate'
          sx={{ width: '100px', ml: 3, my: 2 }}
          className='play-rate-slider'
          min={0.5}
          max={1.5}
          step={0.05}
        />
        <Typography variant='body1' sx={{ textAlign: 'center', width: '60px' }}>
          {value}x
        </Typography>
      </Stack>
    </Menu>
  )

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
      >
        <SlowMotionVideo />
      </IconButton>
      {renderMenu}
    </Box>
  )
})

export default PlayRate
