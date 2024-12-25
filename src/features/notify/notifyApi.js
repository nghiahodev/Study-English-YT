import privateAxios from '~/api/privateAxios'

const notifyApi = {
  getUserNotifies() {
    return privateAxios.get('/notify/user')
  },
  updateNotify(id, body) {
    return privateAxios.patch(`/notify/${id}`, body)
  },
  deleteNotify(id) {
    return privateAxios.delete(`/notify/${id}`)
  }
}

export default notifyApi
