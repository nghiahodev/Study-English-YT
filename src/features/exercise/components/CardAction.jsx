import { useEffect, useState } from 'react'

import {
  Comment,
  ExpandLess,
  ExpandMore,
  HowToReg,
  ThumbDownOutlined,
  ThumbUpOutlined
} from '@mui/icons-material'
import { Box, Button, Collapse, Stack, Typography } from '@mui/material'
import _ from 'lodash'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'
import useAuth from '~/hooks/useAuth'

const CardAction = ({ isCollapse = false, exercise, newComment }) => {
  const auth = useAuth()
  const [showMoreInfo, setShowMoreInfo] = useState(!isCollapse)
  const [isCommented, setIsCommented] = useState(
    exercise.commentedUsers?.includes(auth.id)
  )
  const [commentedCount, setCommentedCount] = useState(exercise.commentedCount)
  const [likedUsers, setLikedUsers] = useState(exercise.likedUsers)
  const [dislikedUsers, setDislikedUsers] = useState(exercise.dislikedUsers)

  const isLiked = likedUsers.includes(auth.id)
  const isDisliked = dislikedUsers.includes(auth.id)
  const isCompleted = exercise.completedUsers.includes(auth.id)

  const handleToggleLike = async () => {
    try {
      const likedUsers = await exerciseApi.toggleLike({
        exerciseId: exercise.id
      })
      setLikedUsers(likedUsers)
      if (likedUsers.includes(auth.id))
        customToast.success('Thích video thành công!')
      else customToast.success('Bỏ thích video thành công!')
    } catch (error) {
      customToast.error(error.data.message)
    }
  }
  const handleToggleDislike = async () => {
    try {
      const dislikedUsers = await exerciseApi.toggleDislike({
        exerciseId: exercise.id
      })
      setDislikedUsers(dislikedUsers)
      if (dislikedUsers.includes(auth.id))
        customToast.success('Không thích video thành công!')
      else customToast.success('Bỏ không thích video thành công!')
    } catch (error) {
      customToast.error(error.data.message)
    }
  }

  useEffect(() => {
    if (!_.isEmpty(newComment)) {
      if (!isCommented) setIsCommented(true)
      setCommentedCount((prev) => prev + 1)
    }
  }, [newComment])
  return (
    <Box mb={2}>
      <Box
        display={'flex'}
        alignItems='center'
        justifyContent={'space-between'}
      >
        <Stack direction='row' gap={1}>
          <Stack
            direction='row'
            gap={2}
            padding='2px 10px'
            borderRadius='10px'
            border={'1px solid #959595'}
            bgcolor={'background.highlight'}
          >
            <Stack direction='row' gap='2px'>
              <ThumbUpOutlined
                sx={{
                  fontSize: '20px',
                  color: isLiked ? 'primary.main' : '',
                  cursor: 'pointer'
                }}
                onClick={handleToggleLike}
              />
              <Typography variant='body2'>{likedUsers.length}</Typography>
            </Stack>
            <Stack direction='row' gap='2px'>
              <ThumbDownOutlined
                sx={{
                  fontSize: '20px',
                  color: isDisliked ? 'error.main' : '',
                  cursor: 'pointer'
                }}
                onClick={handleToggleDislike}
              />
              <Typography variant='body2'>{dislikedUsers.length}</Typography>
            </Stack>
            <Stack direction='row' gap='2px'>
              <Comment
                sx={{
                  fontSize: '20px',
                  color: isCommented ? 'primary.main' : ''
                }}
              />
              <Typography variant='body2'>{commentedCount || 0}</Typography>
            </Stack>
            <Stack direction='row' gap='2px'>
              <HowToReg
                sx={{
                  fontSize: '20px',
                  color: isCompleted ? 'primary.main' : ''
                }}
              />
              <Typography variant='body2'>
                {exercise.completedUsers.length}
              </Typography>
            </Stack>
          </Stack>
          {/*  */}
          {isCollapse && (
            <Button
              sx={{ p: 0 }}
              endIcon={
                showMoreInfo ? (
                  <ExpandLess sx={{ color: 'primary.main' }} />
                ) : (
                  <ExpandMore sx={{ color: 'primary.main' }} />
                )
              }
              onClick={() => setShowMoreInfo(!showMoreInfo)}
            >
              {showMoreInfo ? 'Less' : 'More'}
            </Button>
          )}
        </Stack>
      </Box>
      {/*  */}
      <Collapse in={showMoreInfo}>
        <Box mt={2}>
          <Typography variant='body2' sx={{ mt: '2px' }}>
            Thể loại: {exercise.category}
          </Typography>
          <Typography variant='body2' sx={{ mt: '2px' }}>
            Từ vựng cần chép: {exercise.totalDictationWords} words
          </Typography>
          <Typography variant='body2' sx={{ mt: '2px' }}>
            Từ vựng gốc: {exercise.lemmaWords?.length} words
          </Typography>
          <Typography variant='body2' sx={{ mt: '2px' }}>
            Số lượng từ nâng cao: {exercise.difficult} words
          </Typography>
          <Typography variant='body2' sx={{ mt: '2px' }}>
            Tốc độ: {exercise.avgSpeed} WPM
          </Typography>
        </Box>
      </Collapse>
    </Box>
  )
}

export default CardAction
