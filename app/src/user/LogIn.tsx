import React, { FormEvent, useState } from 'react'
import { useAppActions, useAppState } from '../state'
import { Services } from './services'
import { call } from '../app/utils'

export function LogIn () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { server } = useAppState()
  const { user, error } = useAppActions()
  const services = new Services(server)

  const submit = (event: FormEvent) => {
    services
      .login({ username, password })
      .then(u => user.login(u))
      .catch(e => error.show(e))
    event.preventDefault()
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor='login-username'>Username</label>
        <input
          type='text'
          id='login-sername'
          placeholder='Username'
          value={username}
          onChange={call(setUsername)}
        />
      </div>
      <div>
        <label htmlFor='login-password'>Password</label>
        <input
          type='password'
          id='login-password'
          placeholder='Password'
          value={password}
          onChange={call(setPassword)}
        />
      </div>
      <input type='submit' value='Login' disabled={!username || !password} />
    </form>
  )
}
