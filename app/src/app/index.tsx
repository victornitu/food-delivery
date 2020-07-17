import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

import { useAppActions, useAppState } from 'state'
import { LogIn, SignUp } from 'user'
import { Home, Restaurant } from 'shop'
import { Orders } from 'order'

import { Error } from './Error'
import { Services as UserServices } from 'user/services'

export function App () {
  const { user, error, server } = useAppState()
  const actions = useAppActions()
  const userServices = new UserServices(server)

  const logout = () => userServices.logout().then(() => actions.user.logout())

  return (
    <>
      <Router>
        <header>
          <h1>Food Delivery</h1>
          {!user.isDefined && (
            <h1>
              <label htmlFor='login-modal'>Log in</label>
              <span> | </span>
              <label htmlFor='signup-modal'>Sign up</label>
            </h1>
          )}
          <h1>
            <Link to='/' className='icon'>
              <span className='icon-home' />
            </Link>
            {user.isDefined && (
              <>
                <span> | </span>
                <span className='icon'>
                  <span className='icon-lock' onClick={logout} />
                </span>
                <span> | </span>
                <Link to='/orders' className='icon'>
                  <span className='icon-cart' />
                </Link>
              </>
            )}
          </h1>
        </header>
        <main>
          <Error error={error} />
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/restaurant/:name'>
              <Restaurant />
            </Route>
            {user.isDefined && (
              <Route path='/orders'>
                <Orders />
              </Route>
            )}
          </Switch>
        </main>
      </Router>
      {!user.isDefined && (
        <>
          <input type='checkbox' id='login-modal' className='modal' />
          <div>
            <div className='card large'>
              <label htmlFor='login-modal' className='modal-close' />
              <h3 className='section'>Log in</h3>
              <LogIn />
            </div>
          </div>
          <input type='checkbox' id='signup-modal' className='modal' />
          <div>
            <div className='card large'>
              <label htmlFor='signup-modal' className='modal-close' />
              <h3 className='section'>Sign up</h3>
              <SignUp />
            </div>
          </div>
        </>
      )}
    </>
  )
}
