import privateAxios from '~/api/privateAxios'

const wordApi = {
  refreshWord() {
    return privateAxios.get('/word/refresh')
  },
  getForgetWords() {
    return privateAxios.get('/word/forget')
  },
  getLevelWords() {
    return privateAxios.get('/word/level')
  }
}

export default wordApi
