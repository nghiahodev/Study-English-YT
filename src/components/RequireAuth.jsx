import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import useAuth from '~/hooks/useAuth'

const RequireAuth = ({ allowedRoles = null, children }) => {
  const navigate = useNavigate()
  const auth = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (allowedRoles !== null) {
      if (!auth) {
        navigate('/login')
      } else if (!allowedRoles.includes(auth.role)) {
        navigate('/login')
      } else setLoading(false)
    }
  }, [allowedRoles, navigate, auth])

  // Trả về null hoặc loading indicator trong khi xác thực
  if (loading) {
    return null
  }

  // Nếu đã xác thực và có quyền, render children hoặc Outlet
  return children ? children : <Outlet />
}

export default RequireAuth
