import React, { useState, useEffect } from 'react'
import { AuthLogic, AuthTypes } from '../logic'

const Component = (props) => {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const stream$ = AuthLogic.stream.subscribe(state => {
      if (state.type === AuthTypes.authenticated) {
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
    })

    return () => stream$.unsubscribe()
  }, [])

  return (
    <>
      <div>
        Hello World
      </div>
      <div>
        <div>This page is not protected but tracks the auth status</div>
        <div>Currently you are {loggedIn ? 'Logged In' : 'Not Logged In'}</div>
      </div>
    </>
  )
}

export default Component
