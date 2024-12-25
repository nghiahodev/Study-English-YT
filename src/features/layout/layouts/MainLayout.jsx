import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { Box } from '@mui/material'

import SideBar from '../components/Sidebar'

const MainLayout = () => {
  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      {/* <Header /> */}
      <SideBar />
      <Box
        sx={{
          ml: (theme) => `calc(${theme.spacing(8)} + 1px)`,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ width: '100%', px: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
export default MainLayout
