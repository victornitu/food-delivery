import React, { useEffect } from 'react'

import { useAppActions, useAppState } from 'state'

import { Summary } from './Order'
import { Services } from './services'

export function Orders () {
  const { user, orders, server } = useAppState()
  const actions = useAppActions()
  const services = new Services(server, user.get())

  useEffect(() => {
    services
      .read()
      .then(o => actions.orders.refresh(o))
      .catch(e => actions.error.show(e))
    // eslint-disable-next-line
  }, [])

  if (!orders) {
    return <div className='spinner' />
  }

  return (
    <>
      <h1>Your Orders:</h1>
      <div className='container'>
        <div className='row'>
          {orders.map(o => (
            <Summary key={o.id} order={o} />
          ))}
        </div>
      </div>
    </>
  )
}
