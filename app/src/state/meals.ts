import { Dispatch } from 'react'
import { Restaurant, Meal, Meals } from 'models'

export enum Type {
  REFRESH = 'REFRESH_MENU',
  APPEND = 'APPEND_MENU',
  UPDATE = 'UPDATE_MENU',
  REMOVE = 'REMOVE_MENU'
}

export type Entry = [Restaurant, Array<Meal>]

export interface Action {
  type: Type | any
  payload: Entry
}

export class Actions {
  constructor (readonly dispatch: Dispatch<Action>) {}

  refresh (menu: Entry) {
    this.dispatch({
      type: Type.REFRESH,
      payload: menu
    })
  }

  append (menu: Entry) {
    this.dispatch({
      type: Type.APPEND,
      payload: menu
    })
  }

  update (menu: Entry) {
    this.dispatch({
      type: Type.UPDATE,
      payload: menu
    })
  }

  remove (menu: Entry) {
    this.dispatch({
      type: Type.REMOVE,
      payload: menu
    })
  }
}

export function reducer (menus: Meals, action: Action): Meals {
  switch (action.type) {
    case Type.REFRESH:
      return handlers(menus, action.payload).refresh()
    case Type.APPEND:
      return handlers(menus, action.payload).append()
    case Type.UPDATE:
      return handlers(menus, action.payload).update()
    case Type.REMOVE:
      return handlers(menus, action.payload).remove()
    default:
      return menus
  }
}

function handlers (menus: Meals, [restaurant, meals]: Entry) {
  const id = restaurant.id
  return {
    refresh: () => ({
      ...menus,
      [id]: meals
    }),
    append: () => ({
      ...menus,
      [id]: [...meals, ...menus[id]]
    }),
    update: () => {
      const [updatedMeal] = meals
      const existingMeals = menus[id].filter(({ id }) => id !== updatedMeal?.id)
      return {
        ...menus,
        [id]: [updatedMeal, ...existingMeals]
      }
    },
    remove: () => {
      const [meal] = meals
      return {
        ...menus,
        [id]: menus[id].filter(({ id }) => id !== meal?.id)
      }
    }
  }
}
