import privateAxios from '~/api/privateAxios'

const commentApi = {
  createComment(body) {
    return privateAxios.post(`/comment`, body)
  },
  toggleLikeComment(body) {
    return privateAxios.post(`/comment/toggle-like`, body)
  },
  getExerciseComments(exerciseId, query) {
    return privateAxios.get(`/comment/${exerciseId}`, { params: query })
  },
  toggleHiddenComment(commentId) {
    return privateAxios.patch(`/comment/${commentId}`)
  }
}

export default commentApi
