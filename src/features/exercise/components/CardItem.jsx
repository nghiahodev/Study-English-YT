import { useState } from 'react'

import styled from '@emotion/styled'
import {
  Delete,
  FitnessCenter,
  LibraryAdd,
  PlayArrow,
  Visibility
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Stack,
  Tooltip,
  tooltipClasses,
  Typography
} from '@mui/material'
import _ from 'lodash'

import CardAction from './CardAction'
import Progress from './Progress'

import exerciseUtil from '../exerciseUtil'
import util from '~/utils'

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '14px' // Kích thước chữ
  }
}))

const CardItem = ({
  exercise = {},
  isCheckInfo = false,
  play = null,
  preview = null
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  return (
    <>
      <Card>
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%', // Tỷ lệ 16:9
            '&:hover .media-icons': {
              opacity: 1 // Hiển thị các biểu tượng khi hover vào Box
            }
          }}
        >
          {play && (!play.isCompleted || (play.isCompleted && play.replay)) && (
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: -30,
                backgroundColor: !play.isCompleted
                  ? 'secondary.main'
                  : 'warning.main',
                width: '100px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'rotate(45deg)',
                zIndex: 1
              }}
            >
              {play.isCompleted ? (
                <FitnessCenter sx={{ fontSize: '20px', color: 'white' }} />
              ) : (
                <Typography
                  sx={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}
                >
                  NEW
                </Typography>
              )}
            </Box>
          )}
          {/* Card Media (Image) */}
          {!isImageLoaded && (
            <Skeleton
              variant='rectangular'
              animation='wave'
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
          )}
          <CardMedia
            component='img'
            image={exercise.thumbnails[3].url}
            alt={exercise.name}
            onLoad={() => setIsImageLoaded(true)} // Khi ảnh tải xong, cập nhật trạng thái
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: !isCheckInfo ? 'pointer' : '',
              display: isImageLoaded ? 'block' : 'none' // Ẩn ảnh cho đến khi nó tải xong
            }}
          />

          {/* Thẻ thời lượng nằm góc dưới bên phải */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8, // Cách đáy một chút
              right: 8, // Cách phải một chút
              backgroundColor: 'rgba(0, 0, 0, 0.7)', // Nền mờ
              color: 'white',
              padding: '2px 6px', // Khoảng cách giữa text và viền
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            {exerciseUtil.formatTime(exercise.duration)}
          </Box>

          {/* IconButtons chỉ hiển thị khi hover và nằm chính giữa */}
          {!isCheckInfo && (
            <Box
              className='media-icons'
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                opacity: 0, // Ẩn các biểu tượng khi không hover
                transition: 'opacity 0.3s ease',
                backgroundColor: 'rgba(0, 0, 0, 0.5)' // Tạo nền mờ phía sau các biểu tượng
              }}
            >
              {play ? (
                <Stack direction='row' gap={2}>
                  {(!play.isCompleted || play.replay) && (
                    <>
                      <Button onClick={play.onPlayClick} variant='contained'>
                        <PlayArrow sx={{ color: 'white' }} />
                      </Button>
                      <Button onClick={play.onDelClick} variant='contained'>
                        <Delete sx={{ color: 'white' }} />
                      </Button>
                    </>
                  )}
                  {play.isCompleted && !play.replay && (
                    <Button onClick={play.onReplayClick} variant='contained'>
                      <FitnessCenter sx={{ color: 'white' }} />
                    </Button>
                  )}
                </Stack>
              ) : (
                <Stack direction='row' gap={2}>
                  <Button onClick={preview.onPreviewClick} variant='contained'>
                    {<Visibility sx={{ color: 'white' }} />}
                  </Button>
                  <Button onClick={preview.onCreateClick} variant='contained'>
                    {<LibraryAdd sx={{ color: 'white' }} />}
                  </Button>
                </Stack>
              )}
            </Box>
          )}
        </Box>
        {/* Card Content */}
        <CardContent>
          {/* Name of the Content */}
          <CustomTooltip title={exercise.title} arrow>
            <Typography
              variant='body1'
              component='div'
              mb={2}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%' // Đặt chiều rộng tối đa nếu cần thiết
              }}
            >
              {exercise.title}
            </Typography>
          </CustomTooltip>

          {/* Avatar and Shared By */}
          {!isCheckInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
              <Avatar
                src={
                  exercise.firstUserId?.picture ||
                  util.getRoboHashUrl(exercise.firstUserId?.id)
                }
                name={exercise.firstUserId?.name}
                size='40'
              />
              <Box>
                <Typography variant='body2'>First completed by</Typography>
                <Typography variant='body2'>
                  {exercise.firstUserId?.name || '? ? ?'}
                </Typography>
              </Box>
            </Box>
          )}
          {/* action */}
          {!isCheckInfo && <CardAction exercise={exercise} />}
          {play && play.score && (
            <Typography textAlign='center' variant='body2' color='primary'>
              Điểm số: {play.score}/100
            </Typography>
          )}
          {play && (
            <Progress
              variant='liner'
              value={play.progress}
              tooltip={
                play.isCompleted
                  ? 'Khả năng nhớ, cần ôn lại nếu < 100%'
                  : 'Tiến độ hoàn thành'
              }
            />
          )}
          {preview && (
            <Progress
              variant='liner'
              value={preview.progress}
              tooltip='Mức độ tương đồng'
            />
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default CardItem
