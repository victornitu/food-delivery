import React, { FormEvent, useEffect, useState } from 'react'
import { call } from '../app/utils'
import { useAppActions, useAppState } from '../state'
import { Services } from './services'

export function SignUp () {
  const { server, roles } = useAppState()
  const actions = useAppActions()
  const services = new Services(server)

  const [role, setRole] = useState(roles[0]?.id)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')

  useEffect(() => {
    services
      .roles()
      .then(r => actions.role.refresh(r))
      .catch(e => actions.error.show(e))
    // eslint-disable-next-line
  }, [])

  const submit = (event: FormEvent) => {
    const request = {
      role,
      username,
      password,
      confirmation
    }
    services
      .signup(request)
      .then(u => actions.user.login(u))
      .catch(e => actions.error.show(e))
    event.preventDefault()
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor='signup-role'>Role</label>
        <select name='signup-role' id='signup-role' onChange={call(setRole)}>
          {roles.map(r => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor='signup-username'>Username</label>
        <input
          type='text'
          id='signup-username'
          placeholder='Username'
          value={username}
          onChange={call(setUsername)}
        />
      </div>
      <div>
        <label htmlFor='signup-password'>Password</label>
        <input
          type='password'
          id='signup-password'
          placeholder='Password'
          value={password}
          onChange={call(setPassword)}
        />
      </div>
      <div>
        <label htmlFor='signup-confirmation'>Confirm</label>
        <input
          type='password'
          id='signup-confirmation'
          placeholder='Password confirmation'
          value={confirmation}
          onChange={call(setConfirmation)}
        />
      </div>
      <input
        type='submit'
        value='Sign up'
        disabled={!username || !password || !confirmation}
      />
    </form>
  )
}
