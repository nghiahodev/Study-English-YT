import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const authPersist = {
  key: 'auth',
  storage: storage
}

export const slice = createSlice({
  name: 'auth',
  initialState: {
    token: null
  },
  reducers: {
    login: (state, action) => {
      const token = action.payload
      state.token = token
    },
    logout: (state) => {
      state.token = null
    }
  }
})

export const { login, logout } = slice.actions
export default persistReducer(authPersist, slice.reducer)
