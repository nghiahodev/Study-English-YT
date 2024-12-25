import React, { useState } from 'react'
import { Controller } from 'react-hook-form'

import { Close, Keyboard } from '@mui/icons-material'
import SearchIcon from '@mui/icons-material/Search'
import { Button, Typography } from '@mui/material'
import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'
import _ from 'lodash'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  border: '1px solid #CCCCCC',
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  height: '40px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const CloseIconWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: '75px',
  top: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  cursor: 'pointer'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: '120px',
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '14px',
    [theme.breakpoints.up('md')]: {
      width: '40ch'
    }
  }
}))

const SuggestionsBox = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 'calc(100% + 10px)',
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  border: '1px solid #CCCCCC',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  zIndex: 10,
  maxHeight: '200px',
  overflowY: 'auto',
  display: 'none',
  '&.show': {
    display: 'block'
  }
}))

const SuggestionItem = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  fontSize: '14px'
}))

const HighlightedText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold'
}))

const SearchField = ({
  label,
  name,
  control,
  rules,
  autoComplete,
  onSubmit,
  onChange,
  value,
  onClickClear,
  onClickSuggestion,
  suggestions = [] // Nhận danh sách gợi ý từ props
}) => {
  const [isFocus, setIsFocus] = useState(false)
  const handleSearchClick = () => {
    onSubmit()
  }

  // Hàm tách chuỗi và tô màu phần khớp
  // Hàm thoát ký tự đặc biệt để tránh lỗi regex

  const getHighlightedSuggestion = (suggestion, value) => {
    if (!value) return suggestion

    // Thoát ký tự đặc biệt trong value
    const escapedValue = _.escapeRegExp(value)

    // Tạo biểu thức chính quy an toàn
    const regex = new RegExp(`(${escapedValue})`, 'gi')

    // Tách chuỗi dựa trên regex
    const parts = suggestion.split(regex)

    return parts.map((part, index) =>
      part.toLowerCase() === value.toLowerCase() ? (
        <HighlightedText key={index}>{part}</HighlightedText>
      ) : (
        part
      )
    )
  }

  return (
    <Search>
      <SearchIconWrapper>
        <Keyboard
          sx={{
            color: 'primary.main',
            opacity: isFocus ? 1 : 0,
            visibility: isFocus ? 'visible' : 'hidden',
            transition: 'opacity 0.1s ease-in-out, visibility 0.1s ease-in-out'
          }}
        />
      </SearchIconWrapper>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <StyledInputBase
            {...field}
            value={field.value || ''}
            placeholder={label}
            inputProps={{
              'aria-label': label,
              autoComplete: autoComplete || 'off'
            }}
            sx={{
              '& .MuiInputBase-input': {
                paddingLeft: isFocus ? '' : '1em',
                transition: 'padding-left 0.1s ease-in-out'
              }
            }}
            spellCheck={false}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setTimeout(() => setIsFocus(false), 200)}
            onChange={(e) => {
              field.onChange(e)
              onChange && onChange(e.target.value)
            }}
          />
        )}
      />

      {value && (
        <CloseIconWrapper onClick={onClickClear}>
          <Close sx={{ color: 'error.main' }} />
        </CloseIconWrapper>
      )}

      <Button
        size='large'
        aria-label='search'
        variant='contained'
        sx={{
          height: '100%',
          right: 0,
          position: 'absolute',
          borderRadius: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0
        }}
        onClick={handleSearchClick}
      >
        <SearchIcon sx={{ color: 'white' }} />
      </Button>

      {/* Hiển thị Suggestion Box nếu có dữ liệu và đang focus */}
      <SuggestionsBox
        className={isFocus && (suggestions.length > 0 || value) ? 'show' : ''}
      >
        {suggestions.length > 0
          ? suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={index}
                onClick={() => onClickSuggestion(suggestion)}
              >
                {getHighlightedSuggestion(suggestion, value)}
              </SuggestionItem>
            ))
          : value && (
              <SuggestionItem>
                <Typography color='warning.main'>
                  Không tìm thấy dữ liệu phù hợp với mô tả của bạn!
                </Typography>
              </SuggestionItem>
            )}
      </SuggestionsBox>
    </Search>
  )
}

export default SearchField
