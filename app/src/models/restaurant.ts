import { User } from './user'

export interface Restaurant {
  id: string
  name: string
  description: string
  owner: User
}

export interface Meal {
  id: string
  name: string
  description: string
  price: number
  restaurant: Restaurant
}

export declare type Meals = { [key: string]: Array<Meal> }

export interface Order {
  id: string
  status: OrderStatus
  date: Date
  customer: User
  restaurant: Restaurant
  meals: Array<Basket>
  total: number
}

export interface Basket {
  meal: Meal
  amount: number
}

export enum OrderStatus {
  Placed = 'PLACED',
  Canceled = 'CANCELED',
  Processing = 'PROCESSING',
  InRoute = 'IN_ROUTE',
  Delivered = 'DELIVERED',
  Received = 'RECEIVED'
}
