import { NoteAlt, StarBorderOutlined } from '@mui/icons-material'
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'

const SegmentNote = ({ note }) => {
  const sentences = note.split('\n')
  return (
    <Box>
      {/* Tiêu đề với icon */}
      <Box display={'flex'} gap={2}>
        <NoteAlt sx={{ color: 'warning.main' }} />
        <Typography>Lưu ý</Typography>
      </Box>

      {/* Danh sách đánh số */}
      <List>
        {sentences.map((el, index) => (
          <ListItem key={index}>
            <StarBorderOutlined
              fontSize='small'
              sx={{ color: 'warning.main', mr: 2 }}
            />
            <ListItemText primary={el} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default SegmentNote
