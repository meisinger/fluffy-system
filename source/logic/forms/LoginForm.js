import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { InputSubject } from '../subjects'

class EmailSubject extends InputSubject {
  constructor(value) {
    super(value)
    this.asRequired('Email is required.')
    this.asEmail('Email is invalid.')
  }
}

class PasswordSubject extends InputSubject {
  constructor(value) {
    super(value)
    this.asRequired('Password is required.')
    this.asRule('Password is required.', (data) => 
      (data && data.length && data.length > 6))
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
      .pipe(map(result => {
        const errors = result
          .map(x => x.validate(x.data))
          .some(x => x.error)
        return !errors
      }))
}
