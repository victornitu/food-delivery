import { Dispatch } from 'react'
import { Restaurant } from 'models'

export enum Type {
  REFRESH = 'REFRESH_RESTAURANTS',
  APPEND = 'APPEND_RESTAURANT',
  DELETE = 'DELETE_RESTAURANT'
}

export interface Action {
  type: Type | any
  payload: Array<Restaurant>
}

export class Actions {
  constructor (readonly dispatch: Dispatch<Action>) {}

  refresh (restaurants: Array<Restaurant>) {
    this.dispatch({
      type: Type.REFRESH,
      payload: restaurants
    })
  }

  append (restaurant: Restaurant) {
    this.dispatch({
      type: Type.APPEND,
      payload: [restaurant]
    })
  }

  delete (restaurant: Restaurant) {
    this.dispatch({
      type: Type.DELETE,
      payload: [restaurant]
    })
  }
}

export function reducer (
  restaurants: Array<Restaurant>,
  action: Action
): Array<Restaurant> {
  switch (action.type) {
    case Type.REFRESH:
      return action.payload
    case Type.APPEND:
      return [...restaurants, ...action.payload]
    case Type.DELETE:
      const [restaurant] = action.payload
      return restaurants.filter(r => r.id !== restaurant.id)
    default:
      return restaurants
  }
}
