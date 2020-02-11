import { BehaviorSubject, combineLatest } from 'rxjs'
import { map, filter } from 'rxjs/operators'

const search = (predicate) => (collection, term) => {
  const term_fix = term.toUpperCase()
  return collection.filter(_ => predicate(_, term_fix))
}

export default class extends BehaviorSubject {
  constructor(items, { predicate, filters, sorts, exclusive_filters = [], exclusive_sorts = [] }) {
    super(items)

    this._activeFilters = new BehaviorSubject({
      active: false,
      sequence: [],
      entries: filters.map(_ => Object.assign({}, _, {
        exclusive: exclusive_filters
          .filter(x => x.some(y => y === _.name))
          .flat()
          .filter(x => x !== _.name)
      }))
    })

    this._activeSorts = new BehaviorSubject({
      active: false,
      sequence: [],
      entries: sorts.map(_ => Object.assign({}, _, {
        exclusive: exclusive_sorts
          .filter(x => x.some(y => y === _.name))
          .flat()
          .filter(x => x !== _.name)
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
          const { active: filter_active, sequence: filter_seqeunce, entries: filter_entries} = filter_context
          const { active: sort_active, sequence: sort_sequence, entries: sort_entries } = sort_context
          const { active: term_active, query, term } = term_context

          let collection = data_context
          if (term_active)
            collection = query(collection, term)

          if (filter_active) {
            collection = filter_seqeunce
              .reduce((agg, item) => {
                const index = filter_entries.findIndex(x => x.name === item)
                if (index !== -1)
                  agg.push(filter_entries[index])
                
                return agg
              }, [])
              .reduce((agg, item) => (
                agg.filter(x => item.predicate(x))
              ), collection)
          }

          if (sort_active) {
            const concerns = sort_sequence
              .reduce((agg, item) => {
                const index = sort_entries.findIndex(x => x.name === item)
                if (index !== -1)
                  agg.push(sort_entries[index])
                
                return agg
              }, [])

            collection = [...collection].sort((a, b) => 
              concerns.reduce((agg, item) => agg || item.func(a, b), 0))
          }

          return collection
        })
      )
  }

  get filters() {
    return this._activeFilters.pipe(
      map(({ sequence, entries }) => 
        entries.map(entry => {
          const { predicate, ...filter } = entry
          return Object.assign(filter, {
            active: (sequence.findIndex(x => x === filter.name) !== -1)
          })
        })
      ))
  }

  get sorts() {
    return this._activeSorts.pipe(
      map(({ sequence, entries }) =>
        entries.map(entry => {
          const { func, ...sort } = entry
          return Object.assign(sort, {
            active: (sequence.findIndex(x => x === sort.name) !== -1)
          })
        })
      ))
  }

  get activeFilters() {
    return this.filters.pipe(filter(x => x.active))
  }

  get activeSorts() {
    return this.sorts.pipe(filter(x => x.active))
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
    const { sequence = [], entries = []} = this._activeFilters.value
    const entry_index = entries.findIndex(x => x.name === name)
    if (entry_index === -1)
      return

    const entry = entries[entry_index]
    const concerns = (sequence.findIndex(x => x === name) === -1)
      ? sequence.concat([name]).filter(x => !entry.exclusive.some(y => y === x))
      : sequence.filter(x => x !== name)

    this._activeFilters.next(
      Object.assign(this._activeFilters.value, {
        active: !!(concerns && concerns.length),
        sequence: concerns
      })
    )
  }

  sort = (name) => {
    const { sequence = [], entries = []} = this._activeSorts.value
    const entry_index = entries.findIndex(x => x.name === name)
    if (entry_index === -1)
        return

    const entry = entries[entry_index]
    const concerns = (sequence.findIndex(x => x === name) === -1)
      ? sequence.concat([name]).filter(x => !entry.exclusive.some(y => y === x))
      : sequence.filter(x => x !== name)

    this._activeSorts.next(
      Object.assign(this._activeSorts.value, {
        active: !!(concerns && concerns.length),
        sequence: concerns
      })
    )
  }
}