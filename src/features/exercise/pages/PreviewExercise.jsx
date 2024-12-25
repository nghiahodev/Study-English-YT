import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  ArrowBack,
  LibraryAdd,
  Public,
  VisibilityOff
} from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import _ from 'lodash'

import PlayVideo from '../components/PlayVideo'
import Segment from '../components/Segment'
import ScrollTopButton from '~/components/ScrollTopBottom'
import Comment from '~/features/comment/components/Comment'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'
import useAuth from '~/hooks/useAuth'

const PreviewExercise = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [exercise, setExercise] = useState({})
  const [timePlay, setTimePlay] = useState({})
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const auth = useAuth()

  const [isPublic, setIsPublic] = useState(null)

  const segments = exercise?.segments

  const handleSegmentIndexChange = (index) => {
    setCurrentSegmentIndex(index)
  }
  const handleCreateClick = async (id) => {
    try {
      await exerciseApi.createDictation({
        exerciseId: id
      })
      customToast.success('Bài tập được tạo thành công!')
    } catch (error) {
      customToast.error(error.data.message)
    }
  }
  const toggleLockClick = async (id) => {
    try {
      const state = await exerciseApi.toggleLockExercise({
        exerciseId: id
      })
      setIsPublic(state === 'public')
      if (state === 'public')
        customToast.success('Video đã được mở lại thành công')
      else customToast.success('Ẩn video thành công!')
    } catch (error) {
      customToast.error(error.data.message)
    }
  }

  const handleSegmentClick = useCallback((segment) => {
    const selection = window.getSelection().toString()
    // Nếu có nội dung được chọn (select), không thực hiện click
    if (selection.length > 0) {
      return
    }

    setTimePlay({ start: segment.start })
  }, [])

  // effect
  useEffect(() => {
    ;(async () => {
      try {
        const exercise = await exerciseApi.getExercise(id)
        if (!exercise) navigate('/not-found')
        else {
          setExercise(exercise)
          setIsPublic(exercise.state === 'public')
        }
      } catch {
        navigate('/not-found')
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // effect currentSegment change
  useEffect(() => {
    if (currentSegmentIndex != null) {
      const start = _.get(segments, `[${currentSegmentIndex}].start`) // Truy cập an toàn vào start
      if (start != null) {
        const element = document.getElementById(`segment-${start}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
  }, [currentSegmentIndex, segments])

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Box width={2 / 3}>
          <PlayVideo
            exercise={exercise}
            onSegmentIndexChange={handleSegmentIndexChange}
            timePlay={timePlay}
            comment
          />
          {/* comment */}
          {exercise.state === 'public' && (
            <Box p={2}>
              {!_.isEmpty(exercise) && <Comment exercise={exercise} />}
            </Box>
          )}
        </Box>
        <Box
          width={1 / 3}
          sx={{
            borderLeft: '1px solid #959595',
            height: '100vh',
            position: 'sticky',
            top: '0'
          }}
        >
          <Box
            sx={{
              height: 'calc(100vh - 56px)'
            }}
          >
            {/* show subtitle */}
            <Box
              height={'100%'}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'space-between'}
            >
              <Box
                sx={{
                  overflowY: 'auto', // Cho phép cuộn khi nội dung tràn
                  overflowX: 'hidden'
                }}
              >
                <Box>
                  {exercise.segments?.map((segment, index) => (
                    <Box key={index}>
                      <Segment
                        segment={segment}
                        isCurrent={currentSegmentIndex === index}
                        onClick={handleSegmentClick}
                      />
                    </Box>
                  ))}
                </Box>
                <Box height='calc(50vh - 56px)'></Box>
              </Box>
            </Box>

            {/* action */}
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              gap={2}
              sx={{
                py: 1,
                px: 2
              }}
            >
              {/* action */}
              <Stack direction='row' gap={2}>
                {auth.role !== 'admin' ? (
                  <IconButton onClick={() => handleCreateClick(exercise.id)}>
                    <LibraryAdd sx={{ color: 'primary.main' }} />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => toggleLockClick(exercise.id)}>
                    {isPublic === null ? null : isPublic ? (
                      <Public fontSize='small' sx={{ color: 'primary.main' }} />
                    ) : (
                      <VisibilityOff
                        fontSize='small'
                        sx={{ color: 'error.main' }}
                      />
                    )}
                  </IconButton>
                )}
              </Stack>
              <Typography variant='body2'>
                <Typography color={'primary.main'} variant='span'>
                  {currentSegmentIndex !== null ? currentSegmentIndex + 1 : '?'}
                </Typography>
                {' / '}
                {exercise.segments?.length}
              </Typography>
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBack sx={{ color: 'error.main' }} />
              </IconButton>
            </Stack>
          </Box>
        </Box>
        <ScrollTopButton />
      </Box>
    </Box>
  )
}

export default PreviewExercise
