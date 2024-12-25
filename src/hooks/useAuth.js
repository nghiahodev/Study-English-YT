import { useSelector } from 'react-redux'

import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
  const auth = useSelector((state) => state.auth)
  const token = auth ? auth.token : null

  if (!token) {
    return auth
  }

  try {
    const decoded = jwtDecode(token) // Giải mã token
    return decoded // Trả về role
  } catch (error) {
    return auth
  }
}

export default useAuth
