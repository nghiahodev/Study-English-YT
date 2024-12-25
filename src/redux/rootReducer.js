import { combineReducers } from '@reduxjs/toolkit'

import auth from '~/features/auth/slices/authSlice'
import level from '~/features/auth/slices/levelSlice'
import theme from '~/features/layout/slices/themeSlice'

// Phải đảm bảo tên của
const rootReducer = combineReducers({
  // Đảm bảo tên thuộc tính phải trùng với name trong createSlice
  auth,
  level,
  theme
})

export default rootReducer
