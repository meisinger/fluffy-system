import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { AuthLogic, AuthTypes } from './logic'
import { AuthContextProvider, AuthContext } from './contexts'
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

    return () => stream$.unsubscribe()
  }, [])

  return (
    <header>
      { !loggedIn ? 'Not Logged In' : 'Logged In' }
    </header>
  )
}

const AuthorizedRoute = ({ component: Component, ...routeProps }) => {
  const { authorized } = useContext(AuthContext)
  return (
    <Route {...routeProps}
      render={(props) => (authorized)
        ? <Component />
        : <Redirect to={{
            pathname: '/login',
            state: { referrer: props.location.pathname }
          }} />
      } />
  )
}

export default () => (
  <Router>
    <Header />
    <section>
      <AuthorizedRoute path='/' exact component={views.Home} />
      <AuthorizedRoute path='/users' exact component={views.Users} />
      <Route path='/login' exact component={views.Login} />
    </section>
  </Router>
)
