import React, { useState, useEffect } from 'react'
import { UsersLogic } from '../logic'

const Component = (props) => {
  const form = UsersLogic.form
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    const stream$ = form.data
      .subscribe(state => setUsers(state))

    return () => stream$.unsubscribe()
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
      <div>
        <input type="text" onChange={(evt) => form.search(evt.target.value)} />
      </div>
      <div>
        <button onClick={form.toggleActive}>Toggle Active</button>
      </div>
      <div>
        <button onClick={form.toggleInactive}>Toggle Inactive</button>
      </div>
      <div>
        <button onClick={form.sortByName}>Sort Name</button>
      </div>
      <div>
        <button onClick={form.sortByActive}>Sort Active</button>
      </div>
    </>
  )
}

export default Component
