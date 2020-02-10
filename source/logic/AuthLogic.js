import { BehaviorSubject } from 'rxjs'
import { LoginForm } from './forms'

export const AuthTypes = {
  empty: 'auth.types.empty',
  authenticated: 'auth.types.authenticated',
  not_authenticated: 'auth.types.not-authenticated'
}

export default new class {
  constructor() {
    this._form = new LoginForm()
    this._state = new BehaviorSubject({
      type: AuthTypes.not_authenticated
    })
  }

  get current() {
    return this._state.value
  }

  get stream() {
    return this._state
  }

  get form() {
    return this._form
  }

  login = () => {
    const payload = this._form.payload()
    console.log(`payload: ${JSON.stringify(payload)}`)

    this._state.next(
      Object.assign(this.current, {
        type: AuthTypes.authenticated
      })
    )
  }
}
