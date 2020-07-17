import React from 'react'
import { Meal, Restaurant } from 'models'

const cardStyle = {
  height: '8rem',
  overflow: 'auto'
}

interface Props {
  restaurant: Restaurant
  meals: Array<Meal>
  placeOrder: () => void
}

export function Basket ({ meals, placeOrder }: Props) {
  if (!meals) {
    return <div className='spinner' />
  }
  return (
    <div className='card col-sm-4'>
      <div className='section'>
        <h2>{meals.length} meals</h2>
      </div>
      <div className='section double-padded'>
        <ul style={cardStyle}>
          {meals.map((m, i) => (
            <li key={`${i}_${m.id}`}>
              {m.name}: {m.price} $
            </li>
          ))}
        </ul>
      </div>
      <div className='section action'>
        <h3>${meals.reduce((sum, m) => sum + m.price, 0)} $</h3>
      </div>
      <div className='section action'>
        <button className='primary' onClick={placeOrder}>
          Place Order
        </button>
      </div>
    </div>
  )
}
