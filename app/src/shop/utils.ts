import { Option, Permission, Restaurant, User } from '../models'

export function match (unformatted: string, param: string): boolean {
  return format(unformatted) === param
}

export function format (unformatted: string) {
  return unformatted.toLowerCase().replace(/ /g, '_')
}

export function isOwner (user: Option<User>): boolean {
  return user
    .map(u => u.permissions.includes(Permission.ManageRestaurant))
    .getOrElse(false)
}

export function isOwning (user: Option<User>, restaurant: Restaurant): boolean {
  return user.map(u => u.id === restaurant.owner.id).getOrElse(false)
}

export function isCustomer (user: Option<User>): boolean {
  return user
    .map(u => u.permissions.includes(Permission.PlaceOrder))
    .getOrElse(false)
}
