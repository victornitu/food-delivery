import React from 'react'
import { Order, OrderStatus } from 'models'
import { isCustomer } from '../shop/utils'
import { useAppActions, useAppState } from '../state'
import { Services } from './services'

const cardStyle = {
  height: '8rem',
  overflow: 'auto'
}

interface Props {
  order: Order
}

export function Summary ({ order }: Props) {
  if (!order || !order.restaurant || !order.meals) {
    return <div className='spinner' />
  }
  return (
    <div className='card col-sm-4'>
      <div className='section'>
        <h2>{order.restaurant.name}</h2>
        <Status status={order.status} />
      </div>
      <div className='section double-padded'>
        <ul style={cardStyle}>
          {order.meals.map(({ amount, meal }) => (
            <li key={`${order.id}_${meal.id}`}>
              {meal.name}: {amount} x {meal.price} $
            </li>
          ))}
        </ul>
      </div>
      <div className='section action'>
        <h3>${order.total}</h3>
      </div>
      <div className='section action'>
        <OrderButton order={order} />
      </div>
    </div>
  )
}

interface StatusProps {
  status: OrderStatus
}

const props = {
  [OrderStatus.Placed]: ['Placed', { backgroundColor: 'orange' }],
  [OrderStatus.Canceled]: ['Canceled', { backgroundColor: 'red' }],
  [OrderStatus.Processing]: ['Processing', { backgroundColor: 'navy' }],
  [OrderStatus.InRoute]: ['In Route', { backgroundColor: 'blue' }],
  [OrderStatus.Delivered]: ['Delivered', { backgroundColor: 'purple' }],
  [OrderStatus.Received]: ['Received', { backgroundColor: 'green' }]
}

function Status ({ status }: StatusProps) {
  const [text, style = {}] = props[status] || ['Unknown', {}]
  return (
    <mark className='tag' style={style}>
      {text}
    </mark>
  )
}

interface ButtonProps {
  order: Order
}

function OrderButton ({ order }: ButtonProps) {
  const { user } = useAppState()
  return isCustomer(user) ? (
    <CustomerButton order={order} />
  ) : (
    <OwnerButton order={order} />
  )
}

function CustomerButton ({ order }: ButtonProps) {
  const { user, server } = useAppState()
  const actions = useAppActions()
  const services = new Services(server, user.get())

  switch (order.status) {
    case OrderStatus.Placed:
      return (
        <button
          className='secondary'
          onClick={() =>
            services
              .cancel(order.id)
              .then(o => actions.orders.update([o]))
              .catch(e => actions.error.show(e))
          }
        >
          Cancel
        </button>
      )
    case OrderStatus.Delivered:
      return (
        <button
          className='tertiary'
          onClick={() =>
            services
              .receive(order.id)
              .then(o => actions.orders.update([o]))
              .catch(e => actions.error.show(e))
          }
        >
          Received
        </button>
      )
    default:
      return null
  }
}

function OwnerButton ({ order }: Props) {
  const { user, server } = useAppState()
  const actions = useAppActions()
  const services = new Services(server, user.get())

  switch (order.status) {
    case OrderStatus.Placed:
      return (
        <button
          className='primary'
          onClick={() =>
            services
              .process(order.id)
              .then(o => actions.orders.update([o]))
              .catch(e => actions.error.show(e))
          }
        >
          Process
        </button>
      )
    case OrderStatus.Processing:
      return (
        <button
          className='inverse'
          onClick={() =>
            services
              .inRoute(order.id)
              .then(o => actions.orders.update([o]))
              .catch(e => actions.error.show(e))
          }
        >
          In Route
        </button>
      )
    case OrderStatus.InRoute:
      return (
        <button
          className='tertiary'
          onClick={() =>
            services
              .deliver(order.id)
              .then(o => actions.orders.update([o]))
              .catch(e => actions.error.show(e))
          }
        >
          Deliver
        </button>
      )
    default:
      return null
  }
}
