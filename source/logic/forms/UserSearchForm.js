import { BehaviorSubject, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'

const search = (predicate) => (collection, term) => {
  const term_fix = term.toUpperCase()
  return collection.filter(_ => predicate(_, term_fix))
}

class SearchSubject extends BehaviorSubject {
  constructor(items, { predicate, filters, sorts }) {
    super(items)

    this._activeFilters = new BehaviorSubject({
      active: false,
      entries: filters.map(_ => Object.assign(_, {
        active: false
      }))
    })

    this._activeSorts = new BehaviorSubject({
      active: false,
      entries: sorts.map(_ => Object.assign(_, {
        active: false
      }))
    })

    this._activeTerm = new BehaviorSubject({
      active: false,
      term: undefined,
      query: search(predicate)
    })
  }

  get data() {
    return combineLatest(this, this._activeTerm, this._activeFilters, this._activeSorts)
      .pipe(
        map(([data_context, term_context, filter_context, sort_context]) => {
          let collection = data_context
          if (filter_context.active)
            collection = filter_context.entries
              .filter(x => x.active)
              .reduce((agg, item) => (
                agg.filter(x => item.predicate(x))
              ), collection)

          if (term_context.active)
            collection = term_context.query(collection, term_context.term)

          if (sort_context.active) {
            sort_context.entries
              .filter(x => x.active)
              .forEach(x => {
                collection = collection.sort(x.func)
                  .map(x => Object.assign({}, x))
              })
          }

          return collection
        })
      )
  }

  search = (term) => {
    this._activeTerm.next(
      Object.assign(this._activeTerm.value, {
        active: (!!term && term.length),
        term: term
      })
    )
  }

  filter = (name) => {
    const entries = this._activeFilters.value.entries
    const exiting_filter = entries.find(x => x.name === name)
    if (!exiting_filter)
      return

    exiting_filter.active = !exiting_filter.active
    this._activeFilters.next({
      active: entries.some(x => x.active),
      entries: entries
    })
  }

  sort = (name) => {
    const entries = this._activeSorts.value.entries
    const existing_sort = entries.find(x => x.name === name)
    if (!existing_sort)
      return

    existing_sort.active = !existing_sort.active
    this._activeSorts.next({
      active: entries.some(x => x.active),
      entries: entries
    })
  }
}

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
        { name: 'Active', func: (a, b) => (a.IsActive < b.IsActive) ? 1 : -1 },
        { name: 'Name', func: (a, b) => (a.Name > b.Name) ? 1 : -1 }
      ]
    })
  }

  get data() { return this._search.data }
  set data(list) { this._search.next(list) }

  toggleActive = () =>
    this._search.filter('Active')

  toggleInactive = () =>
    this._search.filter('Inactive')

  sortByName = () =>
    this._search.sort('Name')

  sortByActive = () => 
    this._search.sort('Active')

  search = (term) =>
    this._search.search(term)
}