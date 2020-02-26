import React, { useState, useEffect } from 'react'
import { AuthLogic, AuthTypes } from '../logic'

export const AuthContext = React.createContext()

export default ({ children }) => {
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const stream$ = AuthLogic.stream
      .subscribe(state => {
        if (state.type === AuthTypes.authenticated)
          setAuthorized(true)
      })

    return () => stream$.unsubscribe()
  }, [])

  const context = {
    authorized
  }

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  )
}
