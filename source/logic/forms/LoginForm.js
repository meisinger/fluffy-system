import { BehaviorSubject, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'

const is_object = (concern) => 
  !!concern && typeof concern === 'object' && !Array.isArray(concern)

const shove = (...funcs) => 
  (x) => funcs.reduce((y, func) => func(y), x)

class InputSubject extends BehaviorSubject {
  constructor(data, options) {
    super(
      Object.assign({}, {
        data: data,
        dirty: false,
        valid: () => this.valid()
      }, options)
    )
  }

  get changed() {
    return shove(
      (val) => Object.assign({}, { data: val, dirty: true }),
      (val) => Object.assign(this.value, val),
      (val) => this.next(val)
    )
  }

  get payload() {
    return this.value.data
  }

  valid = () => {
    const { data, dirty } = this.value
    return dirty && !!data
  }
}

class EmailSubject extends InputSubject {
  constructor(data, options = { required: true }) {
    super(data, options)
  }

  valid = () => {
    const { required, data } = this.value
    if (required && !data)
      return false
    if (!!data && data.indexOf('@') === -1)
      return false

    return true
  }
}

class PasswordSubject extends InputSubject {
  constructor(data, options = { required: true}) {
    super(data, options)
  }

  valid = () => {
    const { data, required } = this.value
    return !(required && !data)
  }
}

export default class {
  constructor() {
    this._username = new EmailSubject(null)
    this._password = new PasswordSubject(null)
  }

  get username() { return this._username }
  get password() { return this._password }

  payload = () =>
    Object.assign({
      username: this._username.payload,
      password: this._password.payload
    })

  valid = () => 
    combineLatest(this._username, this._password)
      .pipe(
        map(_ => _.every(x => x.valid()))
      )
}
