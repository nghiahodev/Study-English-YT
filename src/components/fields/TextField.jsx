import React, { forwardRef } from 'react'
import { Controller } from 'react-hook-form'

import { TextField as MuiTextField } from '@mui/material'

// Sử dụng forwardRef để chuyển tiếp ref vào MuiTextField
const TextField = forwardRef(
  ({ name, control, label, rules, type, ...props }, ref) => {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue=''
        render={({ field, fieldState: { error } }) => (
          <MuiTextField
            {...field}
            inputRef={ref || field.ref} // Truyền ref vào MuiTextField
            label={label}
            type={type || 'text'}
            error={!!error}
            helperText={error ? error.message : ''}
            fullWidth
            size='small'
            margin='normal'
            spellCheck={false}
            sx={{
              '& .MuiTextField-root': {
                backgroundColor: 'background.paper' // Nền phần input
              }
            }}
            {...props}
          />
        )}
      />
    )
  }
)

export default TextField
