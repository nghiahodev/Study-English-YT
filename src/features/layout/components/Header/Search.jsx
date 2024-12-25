import React from 'react'

import SearchIcon from '@mui/icons-material/Search'
import { IconButton } from '@mui/material'
import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'

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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch'
    }
  }
}))

const HeaderSearch = () => {
  const [searchValue, setSearchValue] = React.useState('')
  const [isFocus, setIsFocus] = React.useState(false)
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon
          sx={{
            opacity: isFocus ? 1 : 0,
            visibility: isFocus ? 'visible' : 'hidden',
            transition: 'opacity 0.1s ease-in-out, visibility 0.1s ease-in-out'
          }}
        />
      </SearchIconWrapper>
      <StyledInputBase
        sx={{
          '& .MuiInputBase-input': {
            paddingLeft: isFocus ? '' : '1em',
            transition: 'padding-left 0.1s ease-in-out'
          }
        }}
        placeholder='Search…'
        inputProps={{ 'aria-label': 'search' }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      <IconButton
        size='large'
        color='inherit'
        aria-label='open drawer'
        sx={{
          height: '100%',
          right: 0,
          position: 'absolute',
          borderRadius: 'inherit',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          bgcolor: '#f0f0f0'
        }}
      >
        <SearchIcon />
      </IconButton>
    </Search>
  )
}
export default HeaderSearch
