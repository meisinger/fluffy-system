import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { AuthLogic, AuthTypes } from '../logic'

const useStream = (stream) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    const stream$ = stream
      .subscribe(state => 
        setValue(!!state.data ? state.data : '')
      )
    return () => stream$.unsubscribe()
  }, [])

  return value
}

const InputComponent = (props) => {
  const { stream, type = 'text' } = props
  const value = useStream(stream)

  return (
    <input type={type} value={value} 
      onChange={(evt) => stream.changed(evt.target.value)} />
  )
}

const Component = (props) => {
  const [valid, setValid] = useState(false)
  const location = useLocation();
  const history = useHistory();
  const form = AuthLogic.form

  useEffect(() => {
    const stream$ = AuthLogic.stream
      .subscribe(data => {
        if (data.type === AuthTypes.authenticated) {
          const { state: { referrer = '/' }} = location
          history.push(referrer)
        }
      })

    return () => stream$.unsubscribe()
  }, [])

  useEffect(() => {
    const stream$ = form.valid()
      .subscribe(data => setValid(data))

    return () => stream$.unsubscribe()
  }, [])

  return (
    <>
      <div>
        Hello World
      </div>
      <div>
        <InputComponent stream={form.username} type={'text'} />
        <InputComponent stream={form.password} type={'password'} />
        <button disabled={!valid} onClick={AuthLogic.login}>Login</button>
      </div>
    </>
  )
}

export default Component

