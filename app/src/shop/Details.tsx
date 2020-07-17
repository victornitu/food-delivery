import React, { useEffect, useState } from 'react'
import { Meal, Restaurant } from '../models'
import { useAppActions, useAppState } from '../state'
import { Services } from './services'
import { Create } from './meal/Create'
import { Empty, Summary } from './meal/Summary'
import { isCustomer } from './utils'
import { Basket } from './meal/Basket'

interface Props {
  restaurant: Restaurant
}

export function Unknown () {
  return <h1>Unknown restaurant</h1>
}

export function Details ({ restaurant }: Props) {
  const { user, menus, server } = useAppState()
  const actions = useAppActions()
  const meals = menus[restaurant.id]
  const services = new Services(server, user.isDefined ? user.get() : undefined)

  const [selection, setSelection] = useState<Array<Meal>>([])

  useEffect(() => {
    services
      .details(restaurant)
      .then(m => actions.meals.refresh([restaurant, m]))
      .catch(e => actions.error.show(e))
    // eslint-disable-next-line
  }, [])

  const placeOrder = () => {
    services
      .order(restaurant, meals)
      .then(o => actions.orders.append([o]))
      .then(() => setSelection([]))
      .catch(e => actions.error.show(e))
  }

  const addToBasket = (m: Meal) => {
    setSelection([...selection, m])
  }

  if (!meals) {
    return <div className='spinner' />
  }

  return (
    <>
      <h1>{restaurant.name}</h1>
      <div className='container'>
        <div className='row'>
          <Create restaurant={restaurant} />
          {isCustomer(user) && (
            <Basket
              restaurant={restaurant}
              meals={selection}
              placeOrder={placeOrder}
            />
          )}
          {!meals.length && <Empty />}
          {meals.map(m => (
            <Summary
              key={m.id}
              meal={m}
              restaurant={restaurant}
              addToBasket={addToBasket}
            />
          ))}
        </div>
      </div>
    </>
  )
}
