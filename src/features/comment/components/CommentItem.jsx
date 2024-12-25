import { useEffect, useRef, useState } from 'react'

import { ExpandLess, ExpandMore, ThumbUpAltOutlined } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Collapse,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import _ from 'lodash'

import CommentForm from './CommentForm'

import customToast from '~/config/toast'
import commentApi from '~/features/comment/commentApi'
import util from '~/utils'

const CommentItem = ({
  comment,
  subReply = false,
  handleCreate,
  handleLikeChange,
  onToggleLike,
  userId,
  targetCommentId = null,
  role,
  onHidden
}) => {
  const [reply, setReply] = useState(false)
  const [isShowReplies, setIsShowReplies] = useState(
    targetCommentId ? true : false
  )
  const [isLiked, setIsLiked] = useState(comment.likes?.includes(userId))

  const commentRef = useRef()

  const isSelfComment = comment.userId.id === userId

  const toggleHidden = async () => {
    try {
      const hiddenComment = await commentApi.toggleHiddenComment(comment.id)
      onHidden(hiddenComment)
      if (hiddenComment.state === 'hidden')
        customToast.success('Bạn đã ẩn một bình luận thành công!')
      else customToast.success('Bỏ ẩn comment video thành công!')
    } catch (error) {
      console.log(error)
    }
  }

  const handleToggleLike = async () => {
    try {
      const updateComment = await commentApi.toggleLikeComment({
        commentId: comment.id
      })
      setIsLiked(updateComment.likes.includes(userId))
      onToggleLike(updateComment)
      if (updateComment.likes.includes(userId))
        customToast.success('Thích comment thành công!')
      else customToast.success('Bỏ thích comment video thành công!')
    } catch (error) {
      console.log(error)
    }
  }

  const scrollToComment = () => {
    // Cuộn tới comment nếu đúng
    if (commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  useEffect(() => {
    if (comment.id === targetCommentId) {
      setIsShowReplies(true)
      setReply(true)
      scrollToComment()
    }
  }, [targetCommentId])

  return (
    <Box
      ref={commentRef}
      sx={{
        width: '100%'
      }}
    >
      <Stack direction='row' spacing={2} sx={{ width: '100%' }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            sx={{ width: 40, height: 40 }}
            name={comment.userId?.name}
            src={
              !_.isEmpty(comment.userId) &&
              (comment.userId.picture || util.getRoboHashUrl(comment.userId.id))
            }
          />
        </Box>
        <Box width={'100%'}>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            <Typography
              fontSize={'13px'}
              fontWeight={'600'}
              color={isSelfComment && 'primary'}
            >
              {comment.userId?.name}
            </Typography>

            {/* Check if the user is an admin, and display the tag */}
            {comment.userId?.role === 'admin' && (
              <Typography
                fontSize={'12px'}
                color={'white'}
                fontWeight={'600'}
                sx={{
                  backgroundColor: 'primary.main',
                  padding: '2px 6px',
                  borderRadius: '12px'
                }}
              >
                Admin
              </Typography>
            )}

            <Typography fontSize={'12px'}>
              {util.getTimeSince(comment.createdAt)}
            </Typography>
          </Box>
          <Typography variant='body2' my={1}>
            {comment.mentionUserId?.name && (
              <Typography component='span' variant='body2' color='secondary'>
                @{comment.mentionUserId?.name}{' '}
              </Typography>
            )}
            {comment.state === 'public' ? (
              comment.content
            ) : (
              <Typography
                component='span'
                variant='body2'
                style={{
                  color: '#D32F2F', // Đỏ Material Design
                  backgroundColor: '#FFF4E6', // Nền nhạt
                  padding: '4px 8px', // Khoảng cách
                  borderRadius: '4px', // Bo góc
                  display: 'inline-block' // Hiển thị dạng khối nhỏ gọn
                }}
              >
                Nội dung này đã bị ẩn do không phù hợp!
              </Typography>
            )}
          </Typography>
          <Box display='flex' gap={2}>
            <Box display='flex' alignItems='center' gap={1}>
              {/* Like comment */}
              <IconButton
                disabled={isSelfComment}
                onClick={handleToggleLike}
                size='small'
              >
                <ThumbUpAltOutlined
                  sx={{
                    color: isLiked ? 'primary.main' : '',
                    opacity: isSelfComment ? 0.5 : 1
                  }}
                />
              </IconButton>
              <Typography variant='body2'>{comment.likes?.length}</Typography>
            </Box>
            {!isSelfComment && (
              <Button
                onClick={() => setReply(true)}
                sx={{ textTransform: 'none', fontSize: '13px' }}
              >
                Trả lời
              </Button>
            )}
            {role === 'admin' && (
              <Button
                onClick={toggleHidden}
                sx={{
                  textTransform: 'none',
                  fontSize: '13px',
                  color: 'error.main'
                }}
              >
                {comment.state === 'public' ? 'Ẩn' : 'Bỏ ẩn'}
              </Button>
            )}
          </Box>
          {/* reply form */}
          {reply && (
            <CommentForm
              reply={reply}
              setReply={setReply}
              exerciseId={comment.exerciseId}
              parentId={comment.id}
              subReply={subReply}
              replyName={comment.userId?.name}
              setIsShowReplies={setIsShowReplies}
              onCreate={handleCreate}
            />
          )}
          {/* show replies */}
          {comment.replies?.length > 0 && (
            <Button
              onClick={() => setIsShowReplies(!isShowReplies)}
              startIcon={!isShowReplies ? <ExpandMore /> : <ExpandLess />}
              sx={{ textTransform: 'none', fontSize: '13px' }}
            >
              {`${comment.replies.length} trả lời`}
            </Button>
          )}
          <Collapse in={isShowReplies}>
            <Box sx={{ mt: 2, pl: 2 }}>
              {comment.replies?.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  subReply={true}
                  handleCreate={handleCreate}
                  onToggleLike={handleLikeChange}
                  userId={userId}
                  targetCommentId={targetCommentId} // Truyền ID cần tìm xuống các reply
                  role={role}
                  onHidden={onHidden}
                />
              ))}
            </Box>
          </Collapse>
        </Box>
      </Stack>
    </Box>
  )
}

export default CommentItem
