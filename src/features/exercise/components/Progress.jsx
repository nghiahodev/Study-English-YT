import * as React from 'react'

import { Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'

function ProgressWithLabel({ value, variant = 'circular', tooltip }) {
  const getColor = (value) => {
    if (value < 25) return '#FFA500' // Màu vàng
    if (value < 50) return '#fff900' // Màu vàng sáng hơn
    if (value < 75) return '#73d2f1' // Màu xanh dương
    return '#54e3a6' // Màu xanh lá
  }

  return variant === 'circular' ? (
    <Tooltip title={tooltip} arrow>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <CircularProgress
          variant='determinate'
          value={100} // Giá trị cố định để giữ cho vòng tròn nền đầy
          sx={{ color: 'grey.300' }} // Màu mặc định cho vòng tròn nền
        />
        <CircularProgress
          variant='determinate'
          value={value}
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            color: getColor(value) // Màu sắc tiến trình động
          }}
        />
        <Box
          sx={{
            top: '50%', // Điều chỉnh để căn giữa theo chiều dọc
            left: '50%', // Điều chỉnh để căn giữa theo chiều ngang
            position: 'absolute',
            transform: 'translate(-50%, -50%)', // Dịch chuyển chính giữa
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant='body2'
            component='div'
            sx={{ color: 'secondary.main', fontSize: '13px' }}
          >
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  ) : (
    <Box sx={{ width: '100%', position: 'relative', mt: 2 }}>
      <Tooltip title={tooltip} arrow>
        <Box>
          <LinearProgress
            variant='determinate'
            value={value}
            sx={{
              height: 16,
              borderRadius: 5,
              backgroundColor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getColor(value)
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Typography
              variant='caption'
              sx={{ color: 'white', fontSize: '13px' }}
            >
              {`${Math.round(value)}%`}
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    </Box>
  )
}

export default function Progress({ value, variant = 'circular', tooltip }) {
  return <ProgressWithLabel value={value} variant={variant} tooltip={tooltip} />
}
