import React from 'react'
import { Controller } from 'react-hook-form'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Box, Button, FormHelperText, styled } from '@mui/material'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const FileField = React.forwardRef(
  ({ name, control, label, rules, hidden, onFileSelect, ...props }, ref) => {
    const fileInputRef = React.useRef(null)

    const handleFileClick = () => {
      fileInputRef.current.click()
    }

    // Hàm xử lý khi chọn file
    const handleFileChange = (e) => {
      const file = e.target.files[0]
      if (file && onFileSelect) {
        const fileURL = URL.createObjectURL(file) // Tạo URL tạm thời cho ảnh
        onFileSelect(file, fileURL) // Gọi hàm từ parent để lưu file và URL
      }
    }

    React.useImperativeHandle(ref, () => ({
      triggerFileInput: handleFileClick // Truyền hàm để kích hoạt việc mở file input
    }))

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => {
          return (
            <Box sx={{ mt: 2, mb: 1 }}>
              <VisuallyHiddenInput
                type='file'
                ref={(e) => {
                  fileInputRef.current = e
                  field.ref(e) // Kết nối với ref của react-hook-form
                }}
                onChange={handleFileChange} // Chọn file và xử lý
                {...props}
              />
              {!hidden && (
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<CloudUploadIcon sx={{ color: '#fff' }} />}
                  onClick={handleFileClick} // Mở cửa sổ chọn file khi click vào button
                >
                  {label}
                </Button>
              )}

              <FormHelperText error={true} sx={{ ml: 2 }}>
                {error?.message}
              </FormHelperText>
            </Box>
          )
        }}
      />
    )
  }
)

FileField.displayName = 'FileField'

export default FileField
