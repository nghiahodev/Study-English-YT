import { useContext, useEffect, useRef } from 'react'

import { SocketContext } from './SocketProvider'

const useSocketContext = (userId) => {
  const socket = useContext(SocketContext)
  const previousUserIdRef = useRef(null) // Lưu trữ userId đã đăng ký trước đó

  if (!socket) {
    throw new Error('Socket chưa được khởi tạo trong SocketProvider')
  }

  useEffect(() => {
    // Chỉ đăng ký lại nếu userId thay đổi và chưa đăng ký
    if (!userId || userId === previousUserIdRef.current) return

    // Đăng ký userId với server
    socket.emit('register', userId)
    previousUserIdRef.current = userId // Cập nhật userId đã đăng ký
    console.log('Socket connected for user:', userId)
  }, [userId, socket])

  return socket
}

export default useSocketContext
