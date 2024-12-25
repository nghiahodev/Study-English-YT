import { useEffect, useRef, useState } from 'react'

import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import _ from 'lodash'

import RankingTable from '../components/RankingTable'

import authApi from '../authApi'

const Ranking = () => {
  const [topUsers, setTopUsers] = useState([])
  const [targetUser, setTargetUser] = useState([])
  const targetUserRef = useRef(null)

  // Hàm xử lý khi click vào nút "Tìm vị trí của tôi"
  const handleScrollToTargetUser = () => {
    if (!targetUserRef.current) return

    const targetPosition = targetUserRef.current.getBoundingClientRect().top
    const startPosition = window.scrollY
    const distance = targetPosition - startPosition
    const duration = 1500
    let startTime = null

    const scroll = (currentTime) => {
      if (!startTime) startTime = currentTime

      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1) // Đảm bảo không vượt quá 1

      // Cuộn trang dần dần
      window.scrollTo(0, startPosition + distance * progress)

      if (timeElapsed < duration) {
        requestAnimationFrame(scroll) // Tiếp tục cuộn cho đến khi hết thời gian
      }
    }

    requestAnimationFrame(scroll) // Bắt đầu quá trình cuộn
  }

  useEffect(() => {
    ;(async () => {
      try {
        const { topUsers, targetUser } = await authApi.getRankingUser()
        setTopUsers(topUsers)
        setTargetUser(targetUser)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  return (
    <Box p={2} display='flex' justifyContent='center'>
      {/* Bảng xếp hạng tổng */}
      <Paper elevation={3} sx={{ padding: 2, width: '1000px' }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <Typography variant='h6'>Bảng Xếp Hạng (Top 10)</Typography>
          <Button
            onClick={handleScrollToTargetUser}
            variant='contained'
            sx={{}}
          >
            Tìm vị trí của tôi
          </Button>
        </Stack>
        {!_.isEmpty(topUsers) && !_.isEmpty(targetUser) && (
          <RankingTable
            users={topUsers}
            targetUser={targetUser}
            ref={targetUserRef}
          />
        )}
      </Paper>
    </Box>
  )
}

export default Ranking
