import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { SearchOff } from '@mui/icons-material'
import {
  Box,
  CircularProgress,
  Grid,
  Pagination,
  Typography
} from '@mui/material'
import _ from 'lodash'
import queryString from 'query-string'

import CardItem from '../components/CardItem'
import Filter from '../components/Filter'
import SearchExercise from '../components/SearchExercise'
import SortMenu from '../components/SortMenu'
import ScrollTopButton from '~/components/ScrollTopBottom'

import exerciseApi from '../exerciseApi'
import exerciseUtil from '../exerciseUtil'
import customToast from '~/config/toast'

const ListExercises = () => {
  const level = useSelector((state) => state.level)
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
  const [levelWords, setLevelWords] = useState([])
  const [resultSearch, setResultSearch] = useState('')

  useEffect(() => {
    // Kiểm tra nếu level và level.words đã có giá trị
    if (level && level.words && Array.isArray(level.words)) {
      setLevelWords(level.words) // Cập nhật levelWords khi có dữ liệu
    }
  }, [level.words])

  const handleChangePage = async (event, value) => {
    setPage(value)
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: Cho hiệu ứng mượt mà
    })
  }
  // Điều hướng đến trang xem trước
  const handlePreviewClick = (id) => {
    navigate(`/exercise/preview/${id}`)
  }

  const handleCreateClick = async (id) => {
    try {
      await exerciseApi.createDictation({
        exerciseId: id
      })
      customToast.success('Bài tập được tạo thành công!')
      navigate('/exercise/playlist')
    } catch (error) {
      customToast.error(error.data.message)
    }
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

      const exercisesWithSimilarity = newExercises.map((exercise) => ({
        ...exercise,
        similarity: exerciseUtil.calculateIntersectionPercentage(
          levelWords,
          exercise.lemmaWords
        )
      }))
      setTotalPages(totalPages)
      setExercises(exercisesWithSimilarity)
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
    // Change url
    navigate({
      pathname: `/exercise/list`,
      search: queryString.stringify(
        { ...query, page },
        { arrayFormat: 'bracket' }
      )
    })
    console.log(query)
    filterExercises()
  }, [query, levelWords])

  useEffect(() => {
    // Change url
    navigate({
      pathname: `/exercise/list`,
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
          <Grid container spacing={3}>
            {exercises.map((exercise) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={exercise._id}>
                <CardItem
                  exercise={exercise}
                  preview={{
                    onPreviewClick: () => handlePreviewClick(exercise._id),
                    onCreateClick: () => handleCreateClick(exercise._id),
                    progress: exercise.similarity
                  }}
                />
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

export default ListExercises
