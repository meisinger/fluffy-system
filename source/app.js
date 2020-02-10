import React, { useState, useEffect } from'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { AuthLogic, AuthTypes } from './logic'
import * as views from './views'
import './styles/main.scss'

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const stream$ = AuthLogic.stream
      .subscribe(data => {
        if (data.type === AuthTypes.authenticated)
          setLoggedIn(true)
      })
  })

  return (
    <header>
      { !loggedIn ? 'Not Logged In' : 'Logged In' }
    </header>
  )
}

export default () => (
  <Router>
    <Header />
    <section>
      <Route path='/' exact component={views.Home} />
      <Route path='/users' exact component={views.Users} />
    </section>
  </Router>
)
