import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  Lock,
  LockOpen,
  Public,
  SearchOff,
  VisibilityOff
} from '@mui/icons-material'
import {
  Box,
  CircularProgress,
  Grid,
  Pagination,
  Stack,
  Typography
} from '@mui/material'
import _, { update } from 'lodash'
import queryString from 'query-string'

import Filter from '../components/Filter'
import LockUserForm from '../components/LockUserForm'
import SearchExercise from '../components/SearchExercise'
import SortMenu from '../components/SortMenu'
import ConfirmDialog from '~/components/ConfirmDialog'
import ScrollTopButton from '~/components/ScrollTopBottom'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'
import authApi from '~/features/auth/authApi'
import util from '~/utils'

const AdminListExercises = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [isScrolled, setIsScrolled] = useState(false)
  const [exercises, setExercises] = useState(null)
  const [query, setQuery] = useState({
    sort: 'completedUsersCount',
    order: 'desc'
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [activeFilter, setActiveFilter] = useState({})
  const [resultSort, setResultSort] = useState({})
  const [resultSearch, setResultSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState({})

  const updateExercises = (updatedUser) => {
    setExercises((prev) => {
      return prev.map((exercise) => {
        // Kiểm tra nếu exercise.firstUserId.id khớp với updatedUser.id
        if (exercise.firstUserId.id === updatedUser.id) {
          // Cập nhật exercise.firstUserId với updatedUser
          return { ...exercise, firstUserId: updatedUser }
        }
        // Nếu không khớp, giữ nguyên exercise
        return exercise
      })
    })
  }

  const handleSubmitLockUser = async (data) => {
    try {
      const updateUser = await authApi.lockUser(data)
      updateExercises(updateUser)
      customToast.success('Khóa tài khoản thành công!')
    } catch (error) {
      console.log(error)
    }
  }

  const handleUnlockUser = async () => {
    try {
      const updateUser = await authApi.unlockUser({ userId: selectedUser.id })
      updateExercises(updateUser)
      customToast.success('Mở tài khoản thành công!')
    } catch (error) {
      console.log(error)
    }
  }
  const handleSelectUser = (user) => {
    setSelectedUser(user)
  }

  const handleCloseSelectedUser = () => {
    setSelectedUser({})
  }

  const handleStateClick = async (id) => {
    try {
      const state = await exerciseApi.toggleLockExercise({
        exerciseId: id
      })
      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === id) exercise.state = state
          return exercise
        })
      )
      if (state === 'public')
        customToast.success('Video đã được mở lại thành công')
      else customToast.success('Video được khóa thành công!')
    } catch (error) {
      customToast.error(error.data.message)
    }
  }

  const handleChangePage = async (event, value) => {
    setPage(value)
  }
  // Điều hướng đến trang xem trước
  const handlePreviewClick = (id) => {
    navigate(`/exercise/preview/${id}`)
  }

  const handleChangeFilter = (filter) => {
    setQuery({
      ...filter,
      q: resultSearch,
      sort: 'completedUsersCount',
      order: 'desc'
    })
    setPage(1)
  }

  const handleChangeSort = (result) => {
    setQuery((prev) => ({ ...prev, ...result }))
    setPage(1)
  }

  // Hàm lọc exercises
  const filterExercises = async () => {
    try {
      const { exercises: newExercises, totalPages } =
        await exerciseApi.getExercises({ ...query, page: Number(page) })

      setTotalPages(totalPages)
      setExercises(newExercises)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    // Lấy category từ URL
    const parsed = queryString.parse(location.search, {
      arrayFormat: 'bracket'
    })
    // Cập nhật query với category mới
    if (!_.isEmpty(parsed)) {
      const { page, ...query } = parsed
      setQuery(query)
      setPage(Number(page))
      const { page: _, sort, order, q, ...filterParsed } = parsed
      setResultSearch(q)
      setActiveFilter(filterParsed)
      setResultSort({ sort, order })
    }
  }, [])

  useEffect(() => {
    if (page === 1) {
      // Change url
      navigate({
        pathname: `/exercise/admin/list`,
        search: queryString.stringify(
          { ...query, page },
          { arrayFormat: 'bracket' }
        )
      })
      filterExercises()
    }
  }, [query])

  useEffect(() => {
    // Change url
    navigate({
      pathname: `/exercise/admin/list`,
      search: queryString.stringify(
        { ...query, page },
        { arrayFormat: 'bracket' }
      )
    })
    filterExercises()
  }, [page])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        // Thay đổi 100 thành giá trị phù hợp
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Box>
      {/* lock user form */}
      <LockUserForm
        open={!_.isEmpty(selectedUser) && !selectedUser.lock?.isLock}
        onClose={handleCloseSelectedUser}
        user={selectedUser}
        onSubmit={handleSubmitLockUser}
      />
      <ConfirmDialog
        open={!_.isEmpty(selectedUser) && selectedUser.lock?.isLock}
        onClose={handleCloseSelectedUser}
        onConfirm={handleUnlockUser}
        content={`Tài khoản này sẽ được mở vào ${util.isoToDateTimeString(selectedUser.lock?.dateOpen)} \n Bạn có chắc mở sớm ?`}
        icon={<LockOpen sx={{ color: 'warning.main', fontSize: 48 }} />}
      />
      <Box
        bgcolor='background.paper'
        p={1}
        position='sticky'
        top={0}
        zIndex={1000}
        boxShadow={isScrolled ? '0px 6px 12px rgba(0, 0, 0, 0.4)' : 'none'} // Tạo bóng đổ mạnh khi cuộn
        mb={2}
        transition='box-shadow 1s ease' // Thêm hiệu ứng mượt mà cho bóng và vị trí
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          gap={1.5}
        >
          <Filter
            onChange={handleChangeFilter}
            searchValue={resultSearch}
            value={activeFilter}
          />
          <SearchExercise
            resultSearch={resultSearch}
            setQuery={setQuery}
            setResultSearch={setResultSearch}
          />
        </Box>
        <SortMenu onChange={handleChangeSort} value={resultSort} />
      </Box>

      {exercises === null ? (
        <Box display='flex' justifyContent='center' my={4}>
          <CircularProgress />
        </Box>
      ) : exercises.length > 0 ? (
        <>
          <Grid container sx={{ p: 1, bgcolor: 'background.paper' }}>
            {/* Header */}
            <Grid
              container
              item
              xs={12}
              sx={{
                fontWeight: 'bold',
                borderBottom: '2px solid #000', // Đường viền đậm cho header
                pb: 1, // Padding dưới
                mb: 1 // Khoảng cách giữa header và hàng đầu tiên
              }}
            >
              <Grid
                item
                sx={{
                  width: '30px', // Chiều rộng cố định cho cột #
                  flexShrink: 0 // Không cho phép co lại
                }}
              >
                <Typography variant='body2' fontWeight='bold'>
                  #
                </Typography>
              </Grid>
              <Grid item sx={{ flex: '0 0 30%' }}>
                <Typography variant='body2' fontWeight='bold'>
                  Tiêu đề
                </Typography>
              </Grid>
              <Grid item sx={{ flex: '0 0 15%' }}>
                <Typography variant='body2' fontWeight='bold'>
                  Người chia sẻ
                </Typography>
              </Grid>
              <Grid item sx={{ flex: '1 1 0' }}>
                <Typography variant='body2' fontWeight='bold'>
                  Thời gian
                </Typography>
              </Grid>
              <Grid item sx={{ flex: '1 1 0' }}>
                <Typography variant='body2' fontWeight='bold'>
                  Hoàn thành
                </Typography>
              </Grid>
              <Grid item sx={{ flex: '1 1 0' }}>
                <Typography variant='body2' fontWeight='bold'>
                  Thích
                </Typography>
              </Grid>
              <Grid item sx={{ flex: '1 1 0' }}>
                <Typography variant='body2' fontWeight='bold'>
                  Không thích
                </Typography>
              </Grid>
              <Grid item sx={{ flex: '1 1 0' }}>
                <Typography variant='body2' fontWeight='bold'>
                  Bình luận
                </Typography>
              </Grid>
              <Grid item sx={{ flex: '1 1 0' }}>
                <Typography variant='body2' fontWeight='bold'>
                  Trạng thái
                </Typography>
              </Grid>
            </Grid>

            {/* Rows */}
            {exercises.map((exercise, index) => (
              <Grid
                container
                item
                xs={12}
                key={exercise._id}
                sx={{
                  borderBottom: '1px solid #ccc', // Đường viền chia cách các hàng
                  py: 1, // Padding trên và dưới
                  mb: 1, // Khoảng cách giữa các hàng
                  alignItems: 'center' // Căn giữa nội dung hàng
                }}
              >
                <Grid
                  item
                  sx={{
                    width: '30px', // Chiều rộng cố định cho cột #
                    flexShrink: 0 // Không co lại
                  }}
                >
                  <Typography variant='body2'>
                    {(page - 1) * 12 + index + 1}
                  </Typography>
                </Grid>
                <Grid
                  item
                  sx={{
                    flex: '0 0 30%',
                    overflow: 'hidden',
                    '&:hover': { cursor: 'pointer' }
                  }}
                  onClick={() => handlePreviewClick(exercise._id)}
                >
                  <Typography variant='body2' noWrap>
                    {exercise.title}
                  </Typography>
                </Grid>
                <Grid
                  item
                  sx={{
                    flex: '0 0 15%',
                    overflow: 'hidden',
                    '&:hover': { cursor: 'pointer' }
                  }}
                >
                  <Stack direction='row' gap={1}>
                    <Typography
                      variant='body2'
                      noWrap
                      onClick={() => handleSelectUser(exercise.firstUserId)}
                    >
                      {exercise.firstUserName
                        ? exercise.firstUserName
                        : 'Admin'}
                    </Typography>
                    {exercise.firstUserId.lock?.isLock && (
                      <Lock sx={{ fontSize: '16px', color: 'error.main' }} />
                    )}
                  </Stack>
                </Grid>
                <Grid item sx={{ flex: '1 1 0' }}>
                  <Typography variant='body2'>
                    {util.getTimeSince(exercise.createdAt)}
                  </Typography>
                </Grid>
                <Grid item sx={{ flex: '1 1 0' }}>
                  <Typography variant='body2'>
                    {exercise.completedUsers.length}
                  </Typography>
                </Grid>
                <Grid item sx={{ flex: '1 1 0' }}>
                  <Typography variant='body2'>
                    {exercise.likedUsers.length}
                  </Typography>
                </Grid>
                <Grid item sx={{ flex: '1 1 0' }}>
                  <Typography variant='body2'>
                    {exercise.dislikedUsers.length}
                  </Typography>
                </Grid>
                <Grid item sx={{ flex: '1 1 0' }}>
                  <Typography variant='body2'>
                    {exercise.commentedCount}
                  </Typography>
                </Grid>
                <Grid
                  item
                  sx={{ flex: '1 1 0' }}
                  onClick={() => handleStateClick(exercise.id)}
                >
                  {exercise.state === 'public' ? (
                    <Public fontSize='small' sx={{ color: 'primary.main' }} />
                  ) : (
                    <VisibilityOff
                      fontSize='small'
                      sx={{ color: 'error.main' }}
                    />
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>

          <Box display='flex' justifyContent='center' my={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              color='primary'
            />
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          justifyContent='center'
          my={4}
          flexDirection='column'
          alignItems='center'
        >
          <SearchOff sx={{ fontSize: '64px', color: 'error.main' }} />
          <Typography variant='h6' color='textSecondary'>
            Không tìm thấy sản phẩm phù hợp với mô tả
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Hãy thử điều chỉnh các tiêu chí tìm kiếm của bạn
          </Typography>
        </Box>
      )}

      <ScrollTopButton />
    </Box>
  )
}

export default AdminListExercises
