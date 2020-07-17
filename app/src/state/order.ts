import { Dispatch } from 'react'
import { Order } from '../models'

export enum Type {
  REFRESH = 'REFRESH_ORDERS',
  APPEND = 'APPEND_ORDERS',
  UPDATE = 'UPDATE_ORDERS'
}

export interface Action {
  type: Type | any
  payload: Array<Order>
}

export class Actions {
  constructor (readonly dispatch: Dispatch<Action>) {}

  refresh (orders: Array<Order>) {
    this.dispatch({
      type: Type.REFRESH,
      payload: orders
    })
  }

  append (orders: Array<Order>) {
    this.dispatch({
      type: Type.APPEND,
      payload: orders
    })
  }

  update (orders: Array<Order>) {
    this.dispatch({
      type: Type.UPDATE,
      payload: orders
    })
  }
}

export function reducer (orders: Array<Order>, action: Action) {
  switch (action.type) {
    case Type.REFRESH:
      return action.payload
    case Type.APPEND:
      return [...action.payload, ...orders]
    case Type.UPDATE:
      const [updated] = action.payload
      const unchanged = orders.filter(o => o.id !== updated.id)
      return [...unchanged, updated]
    default:
      return orders
  }
}
