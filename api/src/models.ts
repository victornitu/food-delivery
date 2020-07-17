export interface User {
  id: string
  username: string
  password: string
  roles: Array<Role>
}

export interface Role {
  id: string
  name: string
  permissions: Array<Permission>
}

export enum Permission {
  PlaceOrder = 'PLACE_ORDER',
  HandleOrder = 'HANDLE_ORDER',
  ManageRestaurant = 'MANAGE_RESTAURANT',
  ManageMeal = 'MANAGE_MEAL'
}

export interface Restaurant {
  id: string
  name: string
  description: string
  owner: User
  status: RestaurantStatus
}

export enum RestaurantStatus {
  Open = 'OPEN',
  Closed = 'CLOSED'
}

export interface Meal {
  id: string
  name: string
  description: string
  price: number
  status: MealStatus
}

export enum MealStatus {
  Available = 'AVAILABLE',
  OutOfStock = 'OUT_OF_STOCK'
}

export interface Order {
  id: string
  date: Date
  status: OrderStatus
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
