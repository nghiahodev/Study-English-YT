// customHook/useRedirect.js
import { useHistory } from 'react-router-dom'

const useRedirect = () => {
  const history = useHistory()

  const redirectToLogin = () => {
    history.push('/login')
  }

  return redirectToLogin
}

export default useRedirect
