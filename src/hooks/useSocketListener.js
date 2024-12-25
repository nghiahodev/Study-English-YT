import { useEffect } from 'react'

import useSocketContext from '~/contexts/useSocketContext'

const useSocketListener = (userId, eventName, callback) => {
  const socket = useSocketContext(userId)

  useEffect(() => {
    if (!eventName || !callback) return

    // Đăng ký lắng nghe sự kiện
    socket.on(eventName, callback)

    console.log(`Listening to event: ${eventName}`)

    // Hủy đăng ký sự kiện khi component unmount
    return () => {
      socket.off(eventName, callback)
      console.log(`Stopped listening to event: ${eventName}`)
    }
  }, [socket, eventName, callback])
}

export default useSocketListener
