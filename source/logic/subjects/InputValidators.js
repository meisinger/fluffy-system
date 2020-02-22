const is_object = (concern) => 
  !!concern && typeof concern === 'object' && !Array.isArray(concern)

const shove = (...funcs) => 
  (x) => funcs.reduce((y, func) => func(y), x)

export const asRequired = (subject) => (message) => {
  subject.validators.push((value) => {
    if (!value) {
      return {
        error: true,
        errorMessage: message || 'Value is required.'
      }
    }
  })
}

export const asRule = (subject) => (message, predicate) => {
  subject.validators.push((value) => {
    if (!predicate(value)) {
      return {
        error: true,
        errorMessage: message || 'Value is not valid.'
      }
    }
  })
}

export const asEmail = (subject) => (message) => {
  subject.validators.push((value) => {
    if (!value)
      return

    const valid = value.length < 256 && /^[^@]+@[^@]{2,}\.[^@]{2,}$/.test(value)
    if (!valid) {
      return {
        error: true,
        errorMessage: message || 'Email is invalid.'
      }
    }
  })
}

export const asMatch = (subject) => (source, message) => {
  subject.validators.push((value) => {
    if (!value)
      return

    const { data, dirty, error } = source.value
    if (!dirty || error)
      return

    if (data !== value) {
      return {
        error: true,
        errorMessage: message || 'Values must match.'
      }
    }
  })
}
