import React, { useRef, useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'

const useStream = (stream) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const stream$ = stream
      .subscribe(state => {
        setValue(!!state.data ? state.data : '')
        setError(state.error)
      })
    return () => stream$.unsubscribe()
  }, [])

  return [value, error]
}

const Placeholder = (props) => {
  const {
    error,
    active,
    placeholder,
    placeholderTint = '#d4d4d4',
    placeholderTintActive = '#4d4d4d',
    placeholderTintError = '#9d0000'
  } = props

  const [prevActive, setPrevActive] = useState(false)
  const [prevError, setPrevError] = useState(false)

  const [topProp, topSet]  = useSpring(() => ({
    to: { position: 'absolute', top: 18, paddingLeft: 0,  pointerEvents: 'none' },
    config: { duration: 125}
  }))

  const [textProp, textSet]  = useSpring(() => ({
    to: { fontSize: 16, color: placeholderTint },
    config: { duration: 125 }
  }))

  useEffect(() => {
    if (active !== prevActive) {
      topSet({
        top: (prevActive) ? 18 : 0,
        paddingLeft: (prevActive) ? 0 : 2
      })
      textSet({ 
        fontSize: (prevActive) ? 16 : 11,
        color: (prevError)
          ? placeholderTintError 
          : (prevActive) 
            ? placeholderTint 
            : placeholderTintActive
      })
    } else if (error !== prevError) {
      textSet({ 
        color: (error) 
          ? placeholderTintError 
          : (prevActive) 
            ? placeholderTintActive 
            : placeholderTint
      })
    }

    setPrevActive(active)
    setPrevError(error)
  }, [active, error])

  return (
    <animated.div style={topProp}>
      <animated.div style={textProp}>
        {placeholder}
      </animated.div>
    </animated.div>
  )
}

export default (props) => {
  const { stream, onFocus, placeholder, type = 'text' } = props
  const [value, error] = useStream(stream)
  const [active, setActive] = useState(false)
  const [placeholderActive, setPlaceholderActive] = useState(false)
  const component = useRef()

  const blurred = () => {
    const { data, dirty } = stream.value
    setActive(false)
    setPlaceholderActive(!!data)
  }

  const focused = () => {
    if (onFocus)
      onFocus()
    else {
      setActive(true)
      setPlaceholderActive(true)
    }
  }

  const focus = () =>
    component.current.focus()

  let placeholder_text = placeholder
  if (error) {
    if (placeholderActive)
      placeholder_text = `${placeholder} - ${stream.value.errorMessage}`
  }

  const container_style = {
    position: 'relative',
    margin: 10,
    paddingTop: 15
  }

  const input_style = {
    height: 25,
    paddingLeft: 2,
    fontSize: 16,
    border: 'none',
    borderBottom: 'solid 0.5px #4d4d4d',
    outline: 'none'
  }

  return (
    <div style={container_style}>
      <Placeholder placeholder={placeholder_text}
        active={placeholderActive}
        error={error} />
      <input type={type} value={value} 
        onBlur={blurred} onFocus={focused} onChange={(evt) => stream.changed(evt.target.value)}
        style={input_style}/>
    </div>
  )
}

