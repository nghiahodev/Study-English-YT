import privateAxios from '~/api/privateAxios'
import publicAxios from '~/api/publicAxios'

const authApi = {
  login(body) {
    return publicAxios.post('/auth/login', body)
  },
  googleLogin(body) {
    return publicAxios.post('/auth/google-login', body)
  },
  register(body) {
    return publicAxios.post('/auth/register', body)
  },
  getUser() {
    return privateAxios.get('/auth')
  },
  getRankingUser() {
    return privateAxios.get('/auth/ranking')
  },
  updateInfo(body) {
    return privateAxios.patch('/auth', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  lockUser(body) {
    return privateAxios.patch('/auth/lock', body)
  },
  unlockUser(body) {
    return privateAxios.patch('/auth/unlock', body)
  }
}

export default authApi
