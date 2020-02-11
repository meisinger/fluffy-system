import { BehaviorSubject } from 'rxjs'
import { SearchSubject } from '../subjects'

export default class {
  constructor() {
    const user_predicate = (user, term) =>
      (user.Name.toUpperCase().indexOf(term) !== -1)

    this._search = new SearchSubject([], {
      predicate: user_predicate,
      filters: [
        { name: 'Active', predicate: (item) => item.IsActive },
        { name: 'Inactive', predicate: (item) => !item.IsActive }
      ],
      sorts: [
        { name: 'Active', func: (a, b) => 
          (a.IsActive === b.IsActive) ? 0 : (a.IsActive < b.IsActive) ? 1 : -1 },
        { name: 'Name ASC', func: (a, b) => 
          (a.Name === b.Name) ? 0 : (a.Name > b.Name) ? 1 : -1 },
        { name: 'Name DESC', func: (a, b) => 
          (a.Name === b.Name) ? 0 : (a.Name < b.Name) ? 1 : -1 }
      ],
      exclusive_filters: [
        ['Active', 'Inactive']
      ],
      exclusive_sorts: [
        ['Name ASC', 'Name DESC']
      ]
    })
  }

  get filters() { return this._search.filters }
  get sorts() { return this._search.sorts }
  get data() { return this._search.data }

  set data(list) { this._search.next(list) }
  
  filter = (name) => 
    this._search.filter(name)

  sort = (name) => 
    this._search.sort(name)

  search = (term) =>
    this._search.search(term)
}