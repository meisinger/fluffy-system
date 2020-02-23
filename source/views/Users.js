// useContext, useMemo, useCallback, useReducer, useRef
// custom hooks e.g. (useIsWaiting)

import React, { useState, useEffect } from 'react'
import { UsersLogic } from '../logic'

const useSearch = (stream, filtering, sorting) => {
  const [data, setData] = useState([])
  const [filters, setFilters] = useState([])
  const [sorts, setSorts] = useState([])

  useEffect(() => {
    const stream$ = stream
      .subscribe(state => setData(state))
    const filter$ = filtering
      .subscribe(state => setFilters(state))
    const sort$ = sorting
      .subscribe(state => setSorts(state))

    return () => {
      filter$.unsubscribe()
      sort$.unsubscribe()
    }
  }, [])

  return {
    data: data,
    filters: filters,
    sorts: sorts
  }
}

const ButtonToggle = (props) => {
  const styles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    height: 20,
    outline: 'none',
    backgroundColor: '#fefefe',
  }

  if (props.active)
    styles.backgroundColor = '#c0c0c0'

  return (
    <button onClick={props.onClick} style={styles}>
      {props.children}
    </button>
  )
}

const Component = (props) => {
  const form = UsersLogic.form
  const { data: users, filters, sorts } = 
    useSearch(form.data, form.filters, form.sorts)

  useEffect(() => UsersLogic.list(), [])

  return (
    <>
      <div>
        Hello World
      </div>
      <div style={{display: 'flex', flexDirection: 'row', margin: '10 0'}}>
        <div style={{marginRight: 20}}>
          <input type="text" style={{outline: 'none'}}
          onChange={(evt) => form.input.changed(evt.target.value)} />
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-start'}}>
          <div style={{display: 'flex', flexDirection: 'column', margin: '0 20'}}>
          {filters && filters.length && filters.map((item, index) => (
            <ButtonToggle key={`filter_${index}`} active={item.active}
              onClick={() => form.filter(item.name)}>
              Filter By {item.name}
            </ButtonToggle>
          ))}
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-start'}}>
          <div style={{display: 'flex', flexDirection: 'column', margin: '0 20'}}>
          {sorts && sorts.length && sorts.map((item, index) => (
            <ButtonToggle key={`sort_${index}`} active={item.active}
              onClick={() => form.sort(item.name)}>
              Sort By {item.name}
            </ButtonToggle>
          ))}
          </div>
        </div>
        
      </div>
      <div>
      {users && users.length && users.map((item, index) => (
        <div key={`user_${index}`} style={{display: 'flex', flexDirection: 'row', margin: '5 0'}}>
          <div style={{width:250}}>{item.Name}</div>
          <div>{item.IsActive ? 'Active': 'Not Active'}</div>
        </div>
      ))}
      </div>
    </>
  )
}

export default Component
