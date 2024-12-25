import axios from 'axios'
import queryString from 'query-string'

import env from '~/config/env'

// Đối với React và React Router

const privateAxios = axios.create({
  baseURL: `${env.API_URL}/v1`,
  paramsSerializer: (params) => queryString.stringify(params),
  headers: {
    'Content-Type': 'application/json'
  }
})

privateAxios.interceptors.request.use(
  async (config) => {
    const auth = localStorage.getItem('persist:auth')
    if (auth && typeof auth === 'string') {
      const authJSON = JSON.parse(auth)
      const token = JSON.parse(authJSON?.token)
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`
        }
      }
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

privateAxios.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    if (err.response.status === 401) {
      localStorage.removeItem('persist:auth')
      // Chuyển hướng về trang đăng nhập
      window.location.href = '/login'
    }
    return Promise.reject(err.response)
  }
)

export default privateAxios
