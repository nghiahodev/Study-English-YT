import { Box, Container, Typography } from '@mui/material'

const NotFound = () => {
  return (
    <Container sx={{ textAlign: 'center', mt: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h2' component='div' gutterBottom>
          404
        </Typography>
        <Typography variant='h5' component='div' gutterBottom>
          Không tìm thấy trang
        </Typography>
        <Typography variant='body1' component='p' gutterBottom>
          Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
        </Typography>
      </Box>
    </Container>
  )
}

export default NotFound
