import { useEffect, useState } from 'react'

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import dayjs from 'dayjs/esm'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  Label,
  Legend,
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
import useAuth from '~/hooks/useAuth'

dayjs.extend(customParseFormat)

const UserStatistic = () => {
  const theme = useTheme() // Lấy theme từ MUI
  const auth = useAuth()

  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('MM-YYYY')) // Giá trị mặc định là tháng hiện tại theo định dạng MM-YYYY
  const [daysInMonth, setDaysInMonth] = useState([])
  const [user, setUser] = useState({})

  const getTotal = (data, key) => {
    return data.reduce((total, item) => total + item[key], 0)
  }

  // Hàm cập nhật danh sách ngày khi thay đổi tháng
  useEffect(() => {
    // api
    ;(async () => {
      try {
        const studyStatistics = await statisticApi.getDays({
          month: selectedMonth,
          userId: auth.id
        })

        const days = []
        const date = dayjs(selectedMonth, 'MM-YYYY')
        const daysInCurrentMonth = date.daysInMonth()

        const today = dayjs()
        const isCurrentMonth = date.isSame(today, 'month')
        const maxDay = isCurrentMonth ? today.date() : daysInCurrentMonth

        for (let i = 1; i <= maxDay; i++) {
          const statistic = studyStatistics.find(
            (stat) => dayjs(stat.day).date() === i
          )
          days.push(
            statistic
              ? {
                  day: i, // Lưu trữ chỉ ngày
                  dictationWordsCount: statistic.dictationWordsCount,
                  forgetWordsCount: statistic.forgetWordsCount,
                  newWordsCount: statistic.newWordsCount
                }
              : {
                  day: i, // Lưu trữ chỉ ngày
                  dictationWordsCount: 0,
                  forgetWordsCount: 0,
                  newWordsCount: 0
                }
          )
        }
        setDaysInMonth(days)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [selectedMonth])

  // Hàm xử lý khi chọn tháng mới
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const user = await authApi.getUser()
        setUser(user)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  return (
    <Box p={2}>
      <Stack
        direction='row'
        gap={2}
        alignItems='center'
        justifyContent='space-between'
      >
        <FormControl sx={{ mb: 2, minWidth: 120 }}>
          <InputLabel>Chọn tháng</InputLabel>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            label='Chọn tháng'
            sx={{
              '& .MuiSelect-select': {
                px: 2,
                py: 1,
                bgcolor: 'background.paper'
              },
              fontSize: '14px'
            }}
          >
            {statisticUtil
              .getAvailableMonths(user.createdAt)
              .map((monthYear) => (
                <MenuItem
                  key={monthYear}
                  value={monthYear} // Sử dụng giá trị MM-YYYY
                  sx={{
                    fontSize: '14px', // Tuỳ chỉnh fontSize cho MenuItem
                    paddingY: '2px' // Tuỳ chỉnh padding vertical cho MenuItem
                  }}
                >
                  {monthYear} {/* Hiển thị MM-YYYY */}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Stack direction='row' gap={10}>
          <Typography variant='body2' color='secondary.main'>
            Tổng từ vựng đã chép: {getTotal(daysInMonth, 'dictationWordsCount')}
          </Typography>
          <Typography variant='body2' color='success.main'>
            Tổng từ vựng mới: {getTotal(daysInMonth, 'newWordsCount')}
          </Typography>
          <Typography variant='body2' color='error.main'>
            Tổng từ vựng có thể quên:{' '}
            {getTotal(daysInMonth, 'forgetWordsCount')}
          </Typography>
        </Stack>
      </Stack>

      <Box sx={{ height: 'calc(100vh - 100px)' }}>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={daysInMonth} margin={{ bottom: 50 }}>
            {/* Trục X */}
            <XAxis dataKey='day' tick={{ fontSize: 14 }}>
              <Label
                value='Ngày trong tháng'
                offset={0}
                position='insideBottom'
                style={{ fontSize: 14 }}
                dy={20}
              />
            </XAxis>

            {/* Trục Y */}
            <YAxis tickCount={10} tick={{ fontSize: 14 }}>
              <Label
                value='Số lượng từ'
                angle={-90}
                position='insideLeft'
                style={{ fontSize: 14 }}
              />
            </YAxis>

            {/* Tooltip */}
            <Tooltip />

            {/* Legend */}
            <Legend
              layout='horizontal'
              verticalAlign='bottom'
              align='center'
              wrapperStyle={{
                fontSize: '14px',
                bottom: '0'
              }}
            />

            {/* Các đường đại diện cho từng loại thống kê */}
            <Line
              type='monotone'
              dataKey='dictationWordsCount'
              stroke={theme.palette.secondary.main}
              name='Từ vựng đã chép'
            />
            <Line
              type='monotone'
              dataKey='newWordsCount'
              stroke={theme.palette.success.main}
              name='Từ vựng mới'
            />
            <Line
              type='monotone'
              dataKey='forgetWordsCount'
              stroke={theme.palette.error.main}
              name='Từ vựng có thể quên'
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export default UserStatistic
