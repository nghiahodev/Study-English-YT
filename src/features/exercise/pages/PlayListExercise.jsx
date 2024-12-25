import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Box } from '@mui/material'

import CompletedList from '../components/CompletedList'
import EmptyList from '../components/EmptyList'
import PlayingList from '../components/PlayingList'
import MenuTabs from '~/components/MenuTabs'

const PlayListExercise = () => {
  const [searchParams] = useSearchParams()

  const [isShowEmpty, setIsShowEmpty] = useState(false)

  //  Lấy giá trị tab từ search params, mặc định là tab 0
  const tabFromUrl = parseInt(searchParams.get('tab')) || null

  const handleEmpty = (isEmpty) => {
    setIsShowEmpty(isEmpty)
  }

  return (
    <Box>
      <MenuTabs
        tab={tabFromUrl}
        tabItems={[
          {
            label: 'Bài tập của tôi',
            component: <PlayingList onEmpty={handleEmpty} />
          },
          {
            label: 'Đã hoàn thành',
            component: <CompletedList onEmpty={handleEmpty} />
          }
        ]}
      />
      {/* Thông báo khi danh sách trống */}
      <EmptyList show={isShowEmpty} />
    </Box>
  )
}

export default PlayListExercise
