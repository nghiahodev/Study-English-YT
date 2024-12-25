import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Box, Fab, useScrollTrigger, Zoom } from '@mui/material'

const ScrollTopButton = () => {
  const trigger = useScrollTrigger({
    threshold: 100 // Hiển thị nút sau khi cuộn xuống 100px
  })

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role='presentation'
        sx={{
          position: 'fixed',
          bottom: 64,
          right: 16,
          zIndex: 1000
        }}
      >
        <Fab color='primary' size='small' aria-label='scroll back to top'>
          <KeyboardArrowUpIcon sx={{ color: 'white' }} />
        </Fab>
      </Box>
    </Zoom>
  )
}

export default ScrollTopButton
