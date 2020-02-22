import DataSubject from './DataSubject'
import * as InputValidators from './InputValidators'

export default class extends DataSubject {
  constructor(value) {
    super({
      data: value,
      dirty: false,
      error: false,
      errorMessage: undefined,
      validate: undefined
    })

    this.validators = []
    this._initial = value
    super.value.validate = this._validate.bind(this, this.validators)
  }

  get asRequired() {
    return InputValidators.asRequired(this)
  }

  get asRule() {
    return InputValidators.asRule(this)
  }

  get asEmail() {
    return InputValidators.asEmail(this)
  }

  get asMatch() {
    return InputValidators.asMatch(this)
  }

  get changed() {
    return (value) => {
      const { validate } = this.value
      const valid = validate(value)

      this.set(Object.assign({
        data: value,
        dirty: (value !== this._initial)
      }, valid))
    }
  }

  get payload() {
    return this.value.data
  }

  clear = () => this.set({
    data: this._initial,
    dirty: false,
    error: false,
    errorMessage: undefined
  })

  _validate = (validators, value) => {
    const errors = validators.map(func => func(value))
      .filter(result => result && result.error)
      .map(result => result.errorMessage)

    return {
      error: (errors && !!errors.length),
      errorMessage: errors.shift()
    }
  }
}
