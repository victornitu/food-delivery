import { OrderStatus } from './models'

export interface Filter {
  name: string
}

export interface Read {
  page: number
  limit: number
}

export interface User {
  username: string,
  password: string,
  role: string
}

export interface Restaurant {
  name: string
  description: string
  owner: string
}

export interface Meal {
  name: string
  description: string
  price: number
  owner: string
  restaurant: string
}

export interface Order {
  owner: string
  restaurant: string
  meals: Array<Basket>
}

export interface Basket {
  meal: string,
  amount: number
}

export interface Update {
  user: string
  order: string
  previous: OrderStatus
  next: OrderStatus
}

export declare type Parameters = {
  [key: string]: any
}

export interface Settings {
  host: string
  port: number
  user: string
  pass: string
}
