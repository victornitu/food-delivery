import { Dispatch } from 'react'
import { Role } from 'models'

export enum Type {
  REFRESH = 'REFRESH_ROLES'
}

export interface Action {
  type: Type | any
  payload: Array<Role>
}

export class Actions {
  constructor (readonly dispatch: Dispatch<Action>) {}

  refresh (roles: Array<Role>) {
    this.dispatch({
      type: Type.REFRESH,
      payload: roles
    })
  }
}

export function reducer (roles: Array<Role>, action: Action): Array<Role> {
  switch (action.type) {
    case Type.REFRESH:
      return action.payload
    default:
      return roles
  }
}
