import axios from 'axios'
import queryString from 'query-string'

import env from '~/config/env'

const publicAxios = axios.create({
  baseURL: `${env.API_URL}/v1`,
  paramsSerializer: (params) => queryString.stringify(params),
  headers: {
    'Content-Type': 'application/json'
  }
})

publicAxios.interceptors.request.use(
  async (config) => {
    return {
      ...config,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  },
  (err) => {
    return Promise.reject(err)
  }
)

publicAxios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error.response)
  }
)

export default publicAxios
