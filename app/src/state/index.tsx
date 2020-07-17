import React, {
  useContext,
  useReducer,
  Context,
  ReactNode,
  Dispatch
} from 'react'
import {
  User,
  Option,
  None,
  Restaurant,
  Order,
  Server,
  Role,
  Meals
} from 'models'
import { Storage } from 'app/storage'

import { getEnv } from './env'
import {
  Type as ErrorType,
  Actions as ErrorActions,
  reducer as errorReducer
} from './error'
import {
  Type as RoleType,
  Actions as RoleActions,
  reducer as roleReducer
} from './role'
import {
  Type as UserType,
  Actions as UserActions,
  reducer as userReducer
} from './user'
import {
  Type as RestaurantType,
  Actions as RestaurantActions,
  reducer as restaurantReducer
} from './restaurant'
import {
  Type as MealsType,
  Actions as MealsActions,
  reducer as mealsReducer
} from './meals'
import {
  Type as OrderType,
  Actions as OrderActions,
  reducer as orderReducer
} from './order'

export interface Action {
  type: ErrorType | RoleType | UserType | RestaurantType | MealsType | OrderType
  payload: any
}

export interface State {
  server: Server
  error: Option<Error>
  roles: Array<Role>
  user: Option<User>
  restaurants: Array<Restaurant>
  menus: Meals
  orders: Array<Order>
}

interface AppActions {
  error: ErrorActions
  role: RoleActions
  user: UserActions
  restaurant: RestaurantActions
  meals: MealsActions
  orders: OrderActions
}

interface AppManager {
  state: State
  actions: AppActions
}

declare type AppContext = Context<AppManager>

const env = getEnv()
const storage = new Storage()

const initialState: State = {
  server: env.server,
  error: new None(),
  roles: [],
  user: storage.getUser(),
  restaurants: [],
  orders: [],
  menus: {}
}

function initActions (dispatch: Dispatch<Action>) {
  return {
    error: new ErrorActions(dispatch),
    role: new RoleActions(dispatch),
    user: new UserActions(dispatch),
    restaurant: new RestaurantActions(dispatch),
    meals: new MealsActions(dispatch),
    orders: new OrderActions(dispatch)
  }
}

const initialContext: AppManager = {
  state: initialState,
  actions: initActions(() => {})
}

const StateContext: AppContext = React.createContext(initialContext)

interface Props {
  children: ReactNode
}

export function StateProvider ({ children }: Props) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const value = {
    state,
    actions: initActions(dispatch)
  }
  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

function appReducer (state: State, action: Action): State {
  return {
    ...state,
    error: errorReducer(state.error, action),
    roles: roleReducer(state.roles, action),
    user: userReducer(state.user, action),
    restaurants: restaurantReducer(state.restaurants, action),
    menus: mealsReducer(state.menus, action),
    orders: orderReducer(state.orders, action)
  }
}

export function useAppState (): State {
  const { state } = useContext(StateContext)
  return state
}

export function useAppActions (): AppActions {
  const { actions } = useContext(StateContext)
  return actions
}
