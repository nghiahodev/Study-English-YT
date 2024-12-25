import { useState } from 'react'

import {
  Assessment,
  AutoGraph,
  EmojiEvents,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  PostAdd,
  Public,
  SportsEsports,
  ViewList
} from '@mui/icons-material'
import { Box, Button, List } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'

import Account from './Account'
import Navigation from './Navigation'

import useAuth from '~/hooks/useAuth'

const openedMixin = (theme) => ({
  width: theme.app.sidebarWidth,
  overflowX: 'hidden'
})

const closedMixin = (theme) => ({
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)} + 1px)`
})

// Dùng cái này khi có header để đẩy sidebar đi xuống khỏi header cố định
// const DrawerHeader = styled('div')(({ theme }) => ({
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   '@media (min-width:600px)': {
//     minHeight: theme.app.headerHeight // Ghi đè min-height cho màn hình >= 600px
//   }
// }))

const Drawer = styled(MuiDrawer, {
  // Không dùng shouldForwardProp khi không cần thiết, nó khiến persistent không work
  // shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: theme.app.sidebarWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': {
      ...openedMixin(theme),
      overflowY: 'hidden'
    }
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': { ...closedMixin(theme), overflowY: 'hidden' }
  })
}))

const Sidebar = () => {
  const [open, setOpen] = useState(false)
  const auth = useAuth()

  return (
    <Drawer
      variant={'permanent'}
      open={open}
      PaperProps={{
        sx: {
          boxShadow: open ? '1px 0px 10px rgba(0, 0, 0, 0.2)' : '', // Chỉ bóng đổ bên phải
          transition: 'width 0.2s ease'
        }
      }}
    >
      {/* <DrawerHeader /> */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {/* control sidebar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: open ? 'initial' : 'center',
            alignSelf: open ? 'end' : ''
          }}
        >
          <Button
            size='large'
            color='inherit'
            aria-label='open drawer'
            onClick={() => setOpen(!open)}
          >
            {!open ? <KeyboardDoubleArrowRight /> : <KeyboardDoubleArrowLeft />}
          </Button>
        </Box>

        {/* List */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
            overflowY: 'auto',
            justifyContent: 'space-between'
          }}
        >
          {auth && auth.role === 'admin' ? (
            <List>
              <Navigation
                text='Tạo bài tập mẫu'
                icon={<PostAdd />}
                openSidebar={open}
                path='/exercise/admin/create'
              />
              <Navigation
                text='Danh sách video'
                icon={<ViewList />}
                openSidebar={open}
                path='/exercise/admin/list?order=desc&page=1&sort=completedUsersCount'
              />
              <Navigation
                text='Thống kê tốc độ phát triển'
                icon={<Assessment />}
                openSidebar={open}
                path='/statistic/admin'
              />
            </List>
          ) : (
            <List>
              <Navigation
                text='Tạo mới bài tập'
                icon={<PostAdd />}
                openSidebar={open}
                path='/exercise/create'
              />
              <Navigation
                text='Làm bài tập'
                icon={<SportsEsports />}
                openSidebar={open}
                path='/exercise/playlist'
              />
              <Navigation
                text='Bài tập được chia sẻ'
                icon={<Public />}
                openSidebar={open}
                path='/exercise/list?order=desc&page=1&sort=completedUsersCount'
              />
              <Navigation
                text='Bảng xếp hạng'
                icon={<EmojiEvents />}
                openSidebar={open}
                path='/user/ranking'
              />
              <Navigation
                text='Thống kê quá trình học'
                icon={<AutoGraph />}
                openSidebar={open}
                path='/statistic'
              />
            </List>
          )}
          <Account openSidebar={open} />
        </Box>
      </Box>
    </Drawer>
  )
}
export default Sidebar
