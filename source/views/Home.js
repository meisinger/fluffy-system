import React, { useState, useEffect } from 'react'
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
  const form = AuthLogic.form
  const [valid, setValid] = useState(false)

  useEffect(() => {
    const stream$ = AuthLogic.stream.subscribe(state => {
      if (state.type === AuthTypes.authenticated) {
        console.log('we should move on from here')
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
