import React, { useState, useEffect } from 'react'
import { UsersLogic } from '../logic'

const Component = (props) => {
  const form = UsersLogic.form
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState([])
  const [sorts, setSorts] = useState([])
  
  useEffect(() => {
    const stream$ = form.data
      .subscribe(state => setUsers(state))

    const filter$ = form.filters
      .subscribe(state =>  setFilters(state))

    const sort$ = form.sorts
      .subscribe(state => setSorts(state))

    return () => {
      stream$.unsubscribe()
      filter$.unsubscribe()
      sort$.unsubscribe()
    }
  }, [])

  useEffect(() => UsersLogic.list(), [])

  return (
    <>
      <div>
        Hello World
      </div>
      <div>
        {users && users.length && users.map((item, index) => (
          <div key={`user_${index}`}>
            {item.Name}: {item.IsActive ? 'Active': 'Not Active'}
          </div>
        ))}
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
        <div style={{display: 'flex', flex: 0.2, flexDirection: 'column', margin: '20 0'}}>
          {filters && filters.length && filters.map((item, index) => (
            <button key={`filter_${index}`} onClick={() => form.filter(item.name)}>Filter By {item.name}</button>
          ))}
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
        <div style={{display: 'flex', flex: 0.2, flexDirection: 'column', margin: '20 0'}}>
          {sorts && sorts.length && sorts.map((item, index) => (
            <button key={`sort_${index}`} onClick={() => form.sort(item.name)}>Sort By {item.name}</button>
          ))}
        </div>
      </div>
      <div style={{margin: '20 0'}}>
        <input type="text" onChange={(evt) => form.search(evt.target.value)} />
      </div>
    </>
  )
}

export default Component
