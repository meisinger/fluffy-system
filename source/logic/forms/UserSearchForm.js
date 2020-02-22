import SearchForm from './SearchForm'

const predicate = (user, term) =>
  (user.Name.toUpperCase().indexOf(term) !== -1)

const filtering = [
  { name: 'Active', predicate: (item) => item.IsActive },
  { name: 'Inactive', predicate: (item) => !item.IsActive }
]

const sorting = [
  { name: 'Active', func: (a, b) => 
    (a.IsActive === b.IsActive) ? 0 : (a.IsActive < b.IsActive) ? 1 : -1 },
  { name: 'Name ASC', func: (a, b) => 
    (a.Name === b.Name) ? 0 : (a.Name > b.Name) ? 1 : -1 },
  { name: 'Name DESC', func: (a, b) => 
    (a.Name === b.Name) ? 0 : (a.Name < b.Name) ? 1 : -1 }
]

const exclusive_filters = [
  ['Active', 'Inactive']
]

const exclusive_sorts = [
  ['Name ASC', 'Name DESC']
]

export default class extends SearchForm {
  constructor() {
    super({ predicate, filtering, sorting, exclusive_filters, exclusive_sorts })
  }
}
