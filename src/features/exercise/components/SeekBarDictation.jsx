import { useEffect, useState } from 'react'

import { Box, Slider } from '@mui/material'

import exerciseUtil from '../exerciseUtil'

const SeekBarDictation = ({
  duration,
  marks,
  start,
  currentTime,
  handlePlay
}) => {
  const [value, setValue] = useState(0) // Giá trị thanh progress

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeCommitted = (event, newValue) => {
    handlePlay(start + newValue, start + duration)
  }

  useEffect(() => {
    setValue(currentTime)
  }, [currentTime])

  return (
    <Box sx={{ width: '100%' }}>
      {/* Thanh slider điều khiển thời gian */}
      <Slider
        onChangeCommitted={handleChangeCommitted}
        value={value}
        onChange={handleChange}
        aria-label='Video Progress'
        valueLabelDisplay='auto'
        valueLabelFormat={(value) => exerciseUtil.formatTime(value + start)}
        marks={marks}
        step={0.1} // Điều chỉnh độ chính xác của slider
        min={0}
        max={duration} // Giá trị tối đa là 100%
        sx={{
          height: 4, // Độ dày của thanh
          '& .MuiSlider-thumb': {
            width: 12, // Kích thước nút kéo
            height: 12
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#e0e0e0', // Màu sắc của rail
            borderRadius: 0
          },
          '& .MuiSlider-mark': {
            height: 6, // Tăng chiều cao của mark
            width: 4, // Tăng độ rộng của mark,
            backgroundColor: 'warning.main'
          }
        }}
      />
    </Box>
  )
}

export default SeekBarDictation
