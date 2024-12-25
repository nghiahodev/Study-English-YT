import { useNavigate } from 'react-router-dom'

import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Typography } from '@mui/material'

const EmptyList = ({ show }) => {
  const navigate = useNavigate()
  const handleFind = () => {
    navigate('/exercise/list')
  }
  const handleCreate = () => {
    navigate('/exercise/create')
  }
  if (!show) {
    return null // Nếu isVisible là false, component không được hiển thị
  }

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      height='100%'
      textAlign='center'
      sx={{
        padding: 3,
        borderRadius: 2,
        backgroundColor: 'background.default'
      }}
    >
      <Typography variant='h5' color='textSecondary' gutterBottom>
        Danh sách đang trống
      </Typography>
      <Typography variant='body1' color='textSecondary' paragraph>
        Hãy nhanh chóng bắt đầu một bài tập mới!
      </Typography>

      <Box display='flex' gap={2} mt={2}>
        <Button
          variant='contained'
          color='primary'
          startIcon={<SearchIcon sx={{ color: 'white' }} />}
          onClick={handleFind}
        >
          Tìm bài tập
        </Button>
        <Button
          variant='outlined'
          color='secondary'
          startIcon={<AddIcon sx={{ color: 'secondary.main' }} />}
          onClick={handleCreate}
        >
          Tự tạo bài tập
        </Button>
      </Box>
    </Box>
  )
}

export default EmptyList
