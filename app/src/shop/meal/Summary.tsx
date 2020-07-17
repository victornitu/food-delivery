import React from 'react'
import { Meal, Restaurant } from 'models'
import { isCustomer, isOwning } from '../utils'
import { useAppActions, useAppState } from 'state'
import { Services } from './services'

const cardStyle = {
  height: '8rem',
  overflow: 'auto'
}

interface Props {
  restaurant: Restaurant
  meal: Meal,
  addToBasket: (m: Meal) => void
}

export function Summary ({meal, restaurant, addToBasket}: Props) {
  const {user, server} = useAppState()
  const actions = useAppActions()
  const services = new Services(server, restaurant, user.isDefined ? user.get() : undefined)

  const remove = () => {
    services
      .delete(meal.id)
      .then(m => actions.meals.remove([restaurant, [m]]))
      .catch(e => actions.error.show(e))
  }

  return (
    <div className='card col-sm-4'>
      <div className='section'>
        <h2>{meal.name}</h2>
      </div>
      <div className='section double-padded'>
        <p style={cardStyle}>{meal.description}</p>
      </div>
      <div className='section action'>
        <h3>${meal.price}</h3>
      </div>
      <div className='section action'>
        {isOwning(user, restaurant) && (
          <>
            <button className='secondary' onClick={remove} >Delete</button>
            <button className='tertiary'>Update</button>
          </>
        )}
        {isCustomer(user) && (
          <button className='primary'
                  onClick={() => addToBasket(meal)}>Add to Basket</button>
        )}
      </div>
    </div>
  )
}

export function Empty () {
  return (
    <div className='card col-sm-4'>
      <div className='section'>
        <h2>No Meals</h2>
      </div>
      <div className='section double-padded'>
        <p style={cardStyle}>
          There is no meals for that restaurant.
          Please come back later.
        </p>
      </div>
    </div>
  )
}
