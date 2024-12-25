import { Box, CardMedia, Grid, Typography } from '@mui/material'

const TableList = ({ exercises }) => {
  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        bgcolor: 'background.paper'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed' // Đảm bảo bảng có layout cố định
        }}
      >
        {/* Header Row */}
        <thead>
          <tr>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                textAlign: 'left',
                width: '4%',
                maxWidth: '4%' // Thiết lập max-width để không vượt quá
              }}
            >
              #
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                textAlign: 'left',
                width: '30%',
                maxWidth: '30%' // Thiết lập max-width để không vượt quá
              }}
            >
              Tiêu đề
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                textAlign: 'left',
                width: '15%',
                maxWidth: '15%' // Thiết lập max-width để không vượt quá
              }}
            >
              Người chia sẻ
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                textAlign: 'left',
                width: '10%',
                maxWidth: '10%' // Thiết lập max-width để không vượt quá
              }}
            >
              Hoàn thành
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                textAlign: 'left',
                width: '10%',
                maxWidth: '10%' // Thiết lập max-width để không vượt quá
              }}
            >
              Thích
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                textAlign: 'left',
                width: '10%',
                maxWidth: '10%' // Thiết lập max-width để không vượt quá
              }}
            >
              Không thích
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                textAlign: 'left',
                width: '10%',
                maxWidth: '10%' // Thiết lập max-width để không vượt quá
              }}
            >
              Bình luận
            </th>
          </tr>
        </thead>

        {/* Data Rows */}
        <tbody>
          {exercises.map((exercise, index) => (
            <tr key={exercise._id}>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  whiteSpace: 'nowrap', // Ngăn không cho nội dung xuống dòng
                  overflow: 'hidden',
                  textOverflow: 'ellipsis' // Hiển thị dấu ba chấm nếu nội dung quá dài
                }}
              >
                {index + 1}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {exercise.title}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {exercise.firstUserName}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {exercise.completedUsers.length}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {exercise.likedUsers.length}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {exercise.dislikedUsers.length}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {exercise.commentedCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  )
}

export default TableList
