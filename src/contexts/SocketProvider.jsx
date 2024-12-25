import React, { createContext, useRef } from 'react'

import { io } from 'socket.io-client'

import env from '~/config/env'

// Tạo Context để lưu trữ socket (lưu trực tiếp socket, không phải object)
export const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null)

  // Khởi tạo socket và lưu trực tiếp vào context
  socketRef.current = io(env.API_URL)

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
