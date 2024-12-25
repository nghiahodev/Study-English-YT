import { forwardRef } from 'react'

import { EmojiEvents } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import _ from 'lodash'

import util from '~/utils'

const RankingTable = forwardRef(({ users, targetUser }, ref) => {
  // Kiểm tra nếu targetUser không nằm trong danh sách users
  const isTargetUserInList =
    users.some((user) => user.id === targetUser.id) || null

  return (
    <TableContainer component={Paper}>
      <Table>
        {/* Tiêu đề cột */}
        <TableHead>
          <TableRow>
            <TableCell align='center'>#</TableCell>
            <TableCell>Người dùng</TableCell>
            <TableCell align='center'>Bài tập</TableCell>
            <TableCell align='center'>Điểm trung bình</TableCell>
            <TableCell align='center'>Từ vựng</TableCell>
          </TableRow>
        </TableHead>
        {/* Dữ liệu bảng */}
        <TableBody>
          {users &&
            users.map((user, index) => (
              <TableRow
                key={index}
                ref={user.id === targetUser.id ? ref : null}
                sx={{
                  bgcolor:
                    user.id === targetUser.id ? 'background.highlight' : ''
                }}
              >
                <TableCell align='center'>{user.ranking}</TableCell>
                <TableCell>
                  <Box display='flex' alignItems='center' gap={1}>
                    <Avatar
                      alt={user.name}
                      src={
                        !_.isEmpty(user) &&
                        (user.picture || util.getRoboHashUrl(user.id))
                      }
                    />
                    <Typography>{user.name}</Typography>
                    {index === 0 && (
                      <EmojiEvents
                        fontSize='large'
                        sx={{ color: 'warning.main' }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align='center'>{user.countExercise}</TableCell>
                <TableCell align='center'>{user.avgScore}</TableCell>
                <TableCell align='center'>{user.accumulatedWord}</TableCell>
              </TableRow>
            ))}

          {/* Nếu targetUser không nằm trong danh sách, thêm hàng với dấu ... */}
          {isTargetUserInList === null && !isTargetUserInList && (
            <>
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  ...
                </TableCell>
              </TableRow>
              <TableRow
                ref={ref} // Gắn ref vào targetUser
                sx={{ bgcolor: 'background.highlight' }}
              >
                <TableCell align='center'>{targetUser.ranking}</TableCell>
                <TableCell>
                  <Box display='flex' alignItems='center' gap={1}>
                    <Avatar
                      alt={targetUser.name}
                      src={
                        !_.isEmpty(targetUser) &&
                        (targetUser.picture ||
                          util.getRoboHashUrl(targetUser.id))
                      }
                    />
                    <Typography>{targetUser.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align='center'>{targetUser.countExercise}</TableCell>
                <TableCell align='center'>{targetUser.avgScore}</TableCell>
                <TableCell align='center'>
                  {targetUser.accumulatedWord}
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
})

export default RankingTable
