import React, { useState, useEffect } from 'react'
import { AuthLogic, AuthTypes } from '../logic'

const Component = (props) => {
  const form = AuthLogic.form
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [valid, setValid] = useState(false)

  useEffect(() => {
    const stream$ = AuthLogic.stream.subscribe(state => {
      if (state.type === AuthTypes.authenticated) {
        console.log('we should move on from here')
      }
    })

    return () => stream$.unsubscribe()
  }, [])

  // add error handling
  useEffect(() => {
    const stream$ = form.username
      .subscribe(state => {
        setUsername(!!state.data ? state.data : '')
      })

    return () => stream$.unsubscribe()
  })

  // add error handling
  useEffect(() => {
    const stream$ = form.password
      .subscribe(state => {
        setPassword(!!state.data ? state.data : '')
      })

    return () => stream$.unsubscribe()
  })

  useEffect(() => {
    const stream$ = form.valid()
      .subscribe(data => setValid(data))

    return () => stream$.unsubscribe()
  })

  return (
    <>
      <div>
        Hello World
      </div>
      <div>
        <input type="text" value={username} 
          onChange={(evt) => form.username.changed(evt.target.value)} />
        <input type="password" value={password}
          onChange={(evt) => form.password.changed(evt.target.value)} />
        <button disabled={!valid} onClick={AuthLogic.login}>Login</button>
      </div>
    </>
  )
}

export default Component
