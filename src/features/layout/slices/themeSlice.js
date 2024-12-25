import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const themePersist = {
  key: 'theme',
  storage: storage
}

export const slice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'light' // Trạng thái mặc định là light mode
  },
  reducers: {
    // Reducer chuyển đổi giữa light và dark mode
    toggleDarkMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
    }
  }
})

// Export action
export const { toggleDarkMode } = slice.actions

// Export reducer với persist
export default persistReducer(themePersist, slice.reducer)
