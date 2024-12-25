import { createSlice } from '@reduxjs/toolkit'

const levelSlice = createSlice({
  name: 'level',
  initialState: {
    words: []
  },
  reducers: {
    addLevelWords: (state, action) => {
      const newWords = action.payload // Nhận array từ làm payload
      // Kết hợp levelWords với newWords và loại bỏ các giá trị trùng lặp
      state.words = [...state.words, ...newWords]
    },
    resetLevelWords: (state) => {
      // Đặt lại mảng words về rỗng
      state.words = []
    }
  }
})

export const { addLevelWords, resetLevelWords } = levelSlice.actions
export default levelSlice.reducer
