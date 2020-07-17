export interface User {
  id: string
  name: string
  permissions: Array<Permission>
  token: string
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
