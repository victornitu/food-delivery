import { Dispatch } from 'react'
import { User, Option, Some, None } from 'models'

export enum Type {
  Login = 'LOGIN',
  Logout = 'LOGOUT'
}

export interface Action {
  type: Type | any
  payload: Option<User>
}

declare type Dispatcher = Dispatch<Action>

export class Actions {
  constructor (readonly dispatch: Dispatcher) {}

  login (user: User) {
    this.dispatch({
      type: Type.Login,
      payload: new Some(user)
    })
  }

  logout () {
    this.dispatch({
      type: Type.Logout,
      payload: new None()
    })
  }
}

export function reducer (user: Option<User>, action: Action): Option<User> {
  switch (action.type) {
    case Type.Login:
      return action.payload
    case Type.Logout:
      return action.payload
    default:
      return user
  }
}
