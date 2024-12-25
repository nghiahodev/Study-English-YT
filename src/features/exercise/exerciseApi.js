import privateAxios from '~/api/privateAxios'

const exerciseApi = {
  checkVideo(body) {
    return privateAxios.post('/exercise/check-video', body)
  },
  createExercise(body) {
    return privateAxios.post('/exercise', body)
  },
  getDictation(id) {
    return privateAxios.get(`/exercise/dictation/${id}`)
  },
  updateDictation(id, body) {
    return privateAxios.patch(`/exercise/dictation/${id}`, body)
  },
  updateDictationSegment(dictationId, segmentId, body) {
    return privateAxios.patch(
      `/exercise/dictation/${dictationId}/segment/${segmentId}`,
      body
    )
  },
  getExercise(videoId) {
    return privateAxios.get(`/exercise/${videoId}`)
  },
  toggleLike(body) {
    return privateAxios.post(`/exercise/toggle-like`, body)
  },
  toggleDislike(body) {
    return privateAxios.post(`/exercise/toggle-dislike`, body)
  },
  toggleLockExercise(body) {
    return privateAxios.patch(`/exercise/toggle-lock`, body)
  },
  getExercises(query) {
    return privateAxios.get('/exercise', { params: query })
  },
  getCategories() {
    return privateAxios.get('/exercise/categories')
  },
  getUserDictations(query) {
    return privateAxios.get('/exercise/user-dictation', { params: query })
  },
  createDictation(body) {
    return privateAxios.post('/exercise/dictation', body)
  },
  delDictation(id) {
    return privateAxios.delete(`/exercise/dictation/${id}`)
  }
}

export default exerciseApi
