import React from 'react'
import { render } from 'react-dom'
import App from './app'
import { AuthContextProvider } from './contexts'

render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  document.getElementById('app-container'))
