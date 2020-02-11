import { BehaviorSubject } from 'rxjs'
import { UserSearchForm } from './forms'

export default new class {
  constructor() {
    this._form = new UserSearchForm()
    this._state = new BehaviorSubject({
      users: []
    })

    this._state
      .subscribe(data => this._form.data = data.users)
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

  list = () => {
    this._state.next({
      users: [
        { Id: 1, Name: 'John Dough', IsActive: true },
        { Id: 2, Name: 'Phillip Franko', IsActive: true },
        { Id: 3, Name: 'Steve Waskco', IsActive: true },
        { Id: 4, Name: 'David Paul', IsActive: true },
        { Id: 5, Name: 'Andria Smith', IsActive: true },
        { Id: 6, Name: 'Chris Stevenson', IsActive: false },
        { Id: 7, Name: 'Bobby Right', IsActive: false }
      ]
    })
  }
}
