import React, { FormEvent, useState } from 'react'

import { useAppActions, useAppState } from 'state'
import { Services } from './services'
import { call, callInt } from 'app/utils'
import { isOwning } from '../utils'
import { Restaurant } from 'models'

interface Props {
  restaurant: Restaurant
}

export function Create ({ restaurant }: Props) {
  const {user, server} = useAppState()
  const actions = useAppActions()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(1)

  if (!isOwning(user, restaurant)) {
    return null
  }

  const services = new Services(server, restaurant, user.get())

  const submit = (event: FormEvent) => {
    services
      .create({name, description, price})
      .then(m => actions.meals.append([restaurant, [m]]))
      .then(() => setName(''))
      .then(() => setDescription(''))
      .then(() => setPrice(1))
      .catch(e => actions.error.show(e))
    event.preventDefault();
  }

  return (
    <form onSubmit={submit} className='card col-sm-4'>
      <span>
        <label htmlFor='new-meal-name'>Meal</label>
        <input
          type="text"
          id='new-meal-name'
          placeholder='Name'
          value={name}
          onChange={call(setName)}
        />
      </span>
      <span>
        <textarea
          id='new-meal-description'
          placeholder='Description'
          value={description}
          onChange={call(setDescription)}
        />
      </span>
      <span>
        <input
          type="number"
          id='new-meal-price'
          placeholder='Price'
          value={price}
          min='1'
          max='1000'
          onChange={callInt(setPrice)}
        />
      </span>
      <input
        type="submit"
        value="Add"
        className='tertiary'
        disabled={!name || !description} />
    </form>
  )
}
