import React from 'react'
import { useHistory } from 'react-router-dom'
import { Restaurant } from 'models'
import { format, isOwning } from './utils'
import { useAppActions, useAppState } from 'state'
import { Services } from './services'

const cardStyle = {
  height: '9rem',
  overflow: 'auto'
}

interface Props {
  restaurant: Restaurant
}

export function Summary ({ restaurant }: Props) {
  const { user, server } = useAppState()
  const actions = useAppActions()
  const services = new Services(server, user.isDefined ? user.get() : undefined)
  const history = useHistory()
  const url = `/restaurant/${format(restaurant.name)}`

  const remove = () => {
    services
      .delete(restaurant)
      .then(r => actions.restaurant.delete(r))
      .catch(e => actions.error.show(e))
  }

  if (!restaurant) {
    return <div className='spinner' />
  }

  return (
    <div className='card col-sm-4'>
      <div className='section'>
        <h2>{restaurant.name}</h2>
      </div>
      <div className='section double-padded'>
        <p style={cardStyle}>{restaurant.description}</p>
      </div>
      <div className='section action'>
        {isOwning(user, restaurant) && (
          <>
            <button className='secondary' onClick={remove}>
              Delete
            </button>
            <button className='tertiary'>Update</button>
          </>
        )}
        <button className='primary' onClick={() => history.push(url)}>
          View
        </button>
      </div>
    </div>
  )
}

export function Empty () {
  return (
    <div className='card col-sm-4'>
      <div className='section'>
        <h2>No Restaurants</h2>
      </div>
      <div className='section double-padded'>
        <p style={cardStyle}>
          There is no restaurants for the moment. Please come back later.
        </p>
      </div>
    </div>
  )
}
