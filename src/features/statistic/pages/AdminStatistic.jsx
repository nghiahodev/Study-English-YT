import { useEffect, useState } from 'react'

import { MenuBook, People } from '@mui/icons-material'
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography
} from '@mui/material'
import dayjs from 'dayjs/esm'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import statisticApi from '../statisticApi'
import statisticUtil from '../statisticUtil'
import authApi from '~/features/auth/authApi'

dayjs.extend(customParseFormat)

const AdminStatistic = () => {
  const [userStatistic, setUserStastic] = useState([])
  const [exerciseStatistic, setExerciseStastic] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalExercises, setTotalExercises] = useState(0)
  const [selectedYear, setSelectedYear] = useState(2024) // Giá trị mặc định là 2024
  const [exerciseInfo, setExerciseInfo] = useState([])

  const handleChange = (event) => {
    setSelectedYear(event.target.value)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const [
          { statistic: userStatistic, totalUsers },
          { statistic: exerciseStatistic, ...subValue }
        ] = await Promise.all([
          statisticApi.getUserStatistic(),
          statisticApi.getExerciseStatistic()
        ])
        setExerciseInfo(subValue)
        setUserStastic(statisticUtil.fillMissingMonths(userStatistic))
        setExerciseStastic(statisticUtil.fillMissingMonths(exerciseStatistic))
        setTotalUsers(totalUsers)
        setTotalExercises(totalExercises)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  const statistics = [
    {
      label: 'Tổng người dùng',
      value: totalUsers,
      icon: <People sx={{ color: 'white' }} />
    },
    {
      label: 'Tổng bài tập',
      value: exerciseInfo.totalExercises,
      icon: <MenuBook sx={{ color: 'white' }} />,
      sub: [
        {
          subLabel: 'Video người quản lý đã tạo',
          subValue: exerciseInfo.totalAdminExercises
        },
        {
          subLabel: 'Bài tập được hoàn thành',
          subValue: exerciseInfo.totalCompletedExercises
        },
        {
          subLabel: 'Số lượt hoàn thành',
          subValue: exerciseInfo.totalCompletionCount
        }
      ]
    }
  ]

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '8px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}
    >
      <Stack
        spacing={2}
        direction={{ md: 'column', lg: 'row' }}
        justifyContent='space-around'
      >
        {statistics.map((stat, index) => (
          <Box key={index} width='100%'>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {/* Biểu tượng */}
              <IconButton
                sx={{
                  backgroundColor: 'secondary.main'
                }}
              >
                {stat.icon}
              </IconButton>

              {/* Nội dung */}
              {stat.sub ? (
                stat.sub.map((sub, index) => (
                  <Box key={index} sx={{ textAlign: 'right' }}>
                    <Typography fontSize={16}>{sub.subLabel}</Typography>
                    <Typography fontSize={16}>{sub.subValue}</Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'right' }}>
                  <Typography fontSize={16}>{stat.label}</Typography>
                  <Typography fontSize={16} sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        ))}
      </Stack>

      <Box display='flex' flexDirection='column' gap={2}>
        <FormControl sx={{ mb: 2, width: 120 }}>
          <InputLabel>Chọn năm</InputLabel>
          <Select
            value={selectedYear} // Giá trị mặc định
            onChange={handleChange} // Hàm xử lý khi thay đổi
            label='Chọn năm'
            sx={{
              '& .MuiSelect-select': {
                px: 2,
                py: 1,
                backgroundColor: 'background.paper'
              },
              fontSize: '14px'
            }}
          >
            <MenuItem
              value={2024} // Đặt giá trị của MenuItem
              sx={{
                fontSize: '14px',
                paddingY: '2px'
              }}
            >
              2024 {/* Hiển thị MM-YYYY */}
            </MenuItem>
          </Select>
        </FormControl>
        {/* Biểu đồ */}
        <Stack direction={'row'} gap={10}>
          <Box width='100%'>
            {/* Thêm tên biểu đồ */}
            <Typography variant='h6' align='center' sx={{ mb: 2 }}>
              Thống kê số lượng người dùng theo tháng
            </Typography>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <ResponsiveContainer width='100%' height={400}>
                <LineChart data={userStatistic} margin={{ bottom: 50 }}>
                  <XAxis dataKey='month' tick={{ fontSize: 14 }}>
                    <Label
                      value='Tháng'
                      offset={0}
                      position='insideBottomRight'
                      style={{ fontSize: 14 }}
                      dy={20}
                    />
                  </XAxis>
                  <YAxis tick={{ fontSize: 14 }}>
                    <Label
                      value='Số lượng người dùng'
                      angle={-90}
                      position='insideLeft'
                      style={{ fontSize: 14 }}
                      dx={10}
                    />
                  </YAxis>
                  <Tooltip />
                  <Line
                    type='monotone'
                    dataKey='countUser'
                    name='Số lượng người dùng'
                    stroke='#3f51b5'
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          <Box width='100%'>
            {/* Thêm tên biểu đồ */}
            <Typography variant='h6' align='center' sx={{ mb: 2 }}>
              Thống kê số lượng bài tập theo tháng
            </Typography>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <ResponsiveContainer width='100%' height={400}>
                <LineChart data={exerciseStatistic} margin={{ bottom: 50 }}>
                  <XAxis dataKey='month' tick={{ fontSize: 14 }}>
                    <Label
                      value='Tháng'
                      offset={0}
                      position='insideBottomRight'
                      style={{ fontSize: 14 }}
                      dy={20}
                    />
                  </XAxis>
                  <YAxis tick={{ fontSize: 14 }}>
                    <Label
                      value='Số lượng bài tập'
                      angle={-90}
                      position='insideLeft'
                      style={{ fontSize: 14 }}
                      dx={10}
                    />
                  </YAxis>
                  <Tooltip />
                  <Line
                    type='monotone'
                    dataKey='countExercise'
                    name='Số lượng bài tập'
                    stroke='#3f51b5'
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default AdminStatistic
