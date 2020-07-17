import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { useAppState, useAppActions } from 'state'

import { Empty, Summary } from './Summary'
import { match } from './utils'
import { Services } from './services'
import { Create } from './Create'
import { Details, Unknown } from './Details'

export function Home () {
  const { restaurants, server } = useAppState()
  const { restaurant, error } = useAppActions()
  const services = new Services(server)

  useEffect(() => {
    services
      .read()
      .then(r => restaurant.refresh(r))
      .catch(e => error.show(e))
    // eslint-disable-next-line
  }, [])

  if (!restaurants) {
    return <div className='spinner' />
  }

  return (
    <div className='container'>
      <div className='row'>
        <Create />
        {!restaurants.length && <Empty />}
        {restaurants.map(r => (
          <Summary key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  )
}

export function Restaurant () {
  const history = useHistory()
  const { restaurants } = useAppState()
  const { name } = useParams()
  const restaurant = restaurants.find(r => match(r.name, name))
  if (!restaurant) {
    history.push('/')
    return <Unknown />
  }
  return <Details restaurant={restaurant!} />
}
