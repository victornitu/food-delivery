import { useAppActions, useAppState } from '../state'
import React, { FormEvent, useState } from 'react'
import { Services } from './services'
import { call } from '../app/utils'
import { isOwner } from './utils'

export function Create () {
  const { user, server } = useAppState()
  const actions = useAppActions()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  if (!isOwner(user)) {
    return null
  }

  const services = new Services(server, user.get())

  const submit = (event: FormEvent) => {
    services
      .create({ name, description })
      .then(r => actions.restaurant.append(r))
      .then(() => setName(''))
      .then(() => setDescription(''))
      .catch(e => actions.error.show(e))
    event.preventDefault()
  }

  return (
    <form onSubmit={submit} className='card col-sm-4'>
      <span>
        <label htmlFor='new-restaurant-name'>Restaurant</label>
        <input
          type='text'
          id='new-restaurant-name'
          placeholder='Name'
          value={name}
          onChange={call(setName)}
        />
      </span>
      <span>
        <textarea
          id='new-restaurant-description'
          placeholder='Description'
          value={description}
          onChange={call(setDescription)}
        />
      </span>
      <input type='submit' value='Add' disabled={!name || !description} />
    </form>
  )
}
