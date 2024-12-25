import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'

import { Box, Fade, Skeleton, Typography } from '@mui/material'
import _ from 'lodash'

import Comment from '~/features/comment/components/Comment'

const hints = [
  'Video tạm thời được ẩn cho đến khi bạn trả lời hoặc đầu hàng',
  'Đừng quên chú ý đến phát âm, nghe và phát âm lại những gì nghe được!',
  'Bạn chỉ cần nhập từ và dấu cách, không cần quan tâm dấu câu và in hoa',
  'Bạn có thể đưa chuột vào từ bị ẩn để xem gợi ý'
  // Thêm các gợi ý khác
]

const PlayVideo = ({
  onSegmentIndexChange,
  onTimeChange,
  timePlay,
  volume = 100,
  rate = 1,
  isHidden = false,
  isPlaying,
  onPlayingChange,
  exercise = {}
}) => {
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentSegment, setCurrentSegment] = useState({
    transText: '...'
  })
  const [hintIndex, setHintIndex] = useState(0)
  const [fadeKey, setFadeKey] = useState(0)

  const playerRef = useRef(null)

  const handleReady = () => {
    setLoading(false) // Ẩn Skeleton khi video sẵn sàng
  }
  // Function to check the current time and update subtitle
  const handleProgress = (state) => {
    const currentTime = state.playedSeconds
    // Find the matching subtitle based on current time
    const findIndex = exercise.segments.findIndex(
      (segment) => currentTime >= segment.start && currentTime <= segment.end
    )
    if (exercise.segments[findIndex])
      setCurrentSegment(exercise.segments[findIndex])

    if (findIndex !== -1) {
      const newSegment = exercise.segments[findIndex]
      setCurrentSegment(newSegment)
      onSegmentIndexChange && onSegmentIndexChange(findIndex) // Thông báo cho component cha
    }
    onTimeChange && onTimeChange(currentTime)
  }

  useEffect(() => {
    if (!_.isEmpty(timePlay)) {
      playerRef.current.seekTo(Number(timePlay.start) + 0.001, 'seconds')
      setPlaying(true)
    }
  }, [timePlay])

  useEffect(() => {
    setPlaying(isPlaying)
  }, [isPlaying])
  useEffect(() => {
    onPlayingChange && onPlayingChange(playing)
  }, [playing])

  useEffect(() => {
    if (isHidden) {
      const interval = setInterval(() => {
        setHintIndex((prevIndex) => (prevIndex + 1) % hints.length)
        setFadeKey((prevKey) => prevKey + 1)
      }, 10000) // Thay đổi gợi ý sau mỗi 10 giây

      return () => clearInterval(interval) // Xóa interval khi `isHidden` thay đổi
    }
  }, [isHidden])

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%' // 16:9 aspect ratio
        }}
      >
        {loading && (
          <Skeleton
            animation='wave'
            variant='rectangular'
            width='100%'
            height='100%'
            sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          />
        )}
        <Box
          sx={{
            display: isHidden ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0)',
            zIndex: 3,
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          <Fade in={isHidden} timeout={1000} key={fadeKey}>
            <Typography variant='body1'>{hints[hintIndex]}</Typography>
          </Fade>
        </Box>
        {exercise.videoId && (
          <ReactPlayer
            url={`https://www.youtube.com/embed/${exercise.videoId}`}
            style={{ position: 'absolute', top: 0, left: 0 }}
            width='100%'
            height='100%'
            onProgress={handleProgress}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            playing={playing}
            ref={playerRef}
            onReady={handleReady} // Ẩn Skeleton khi video đã sẵn sàng
            controls
            volume={volume / 100}
            playbackRate={rate}
            progressInterval={500}
          />
        )}
      </Box>
      <Box
        sx={{
          bottom: '0', // Adjust as needed for lower subtitle
          textAlign: 'center',
          width: '100%',
          px: 2,
          py: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #959595'
        }}
      >
        <Typography fontSize={18} color='secondary' sx={{ userSelect: 'none' }}>
          {currentSegment.transText}
        </Typography>
      </Box>
    </>
  )
}

export default PlayVideo
