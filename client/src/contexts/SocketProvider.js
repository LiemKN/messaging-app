import React, { useState, useContext, useEffect } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ id, children }) {
  const [socket, setSocket] = useState()

  // make a new socket when a the id changes (someone else logs in to app)
  useEffect(() => {
    const newSocket = io('http://localhost:5000', { query: { id } })
    setSocket(newSocket)

    // close socket when session ends
    return () => newSocket.close()
  }, [id])

  return (
    <div>
      <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    </div>
  )
}
