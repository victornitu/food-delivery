import { Dispatch } from 'react'
import { None, Option, Some } from '../models'

export enum Type {
  ShowError = 'SHOW_ERROR',
  HideError = 'HIDE_ERROR'
}

export interface Action {
  type: Type | any
  payload: Option<Error>
}

export class Actions {
  constructor (readonly dispatch: Dispatch<Action>) {}

  show (error: Error) {
    this.dispatch({
      type: Type.ShowError,
      payload: new Some(error)
    })
  }

  hide () {
    this.dispatch({
      type: Type.HideError,
      payload: new None()
    })
  }
}

export function reducer (error: Option<Error>, action: Action): Option<Error> {
  switch (action.type) {
    case Type.ShowError:
      return action.payload
    case Type.HideError:
      return action.payload
    default:
      return error
  }
}
