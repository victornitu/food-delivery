import { Meal, Order, Restaurant, Server, User } from 'models'
import { Client } from 'app/client'

interface CreateRequest {
  name: string
  description: string
}

declare type Baskets = { [id: string]: { amount: number; meal: string } }

export class Services {
  readonly client: Client

  constructor (server: Server, readonly user?: User) {
    this.client = new Client(server)
  }

  async read (): Promise<Array<Restaurant>> {
    const { restaurants } = await this.client.get('restaurants')
    return restaurants
  }

  async details (resaurant: Restaurant): Promise<Array<Meal>> {
    const { meals } = await this.client.get(`meals/${resaurant.id}`)
    return meals
  }

  async create (request: CreateRequest): Promise<Restaurant> {
    const { restaurant } = await this.client.post(
      'restaurants',
      request,
      this.user?.token
    )
    return restaurant
  }

  async order (restaurant: Restaurant, meals: Array<Meal>): Promise<Order> {
    const baskets: Baskets = {}
    for (const m of meals) {
      const basket = baskets[m.id]
      if (basket) {
        basket.amount++
        continue
      }
      baskets[m.id] = { meal: m.id, amount: 1 }
    }
    const request = {
      restaurant: restaurant.id,
      meals: Object.values(baskets)
    }
    return this.client.post('orders', request, this.user?.token)
  }

  async delete ({ id }: Restaurant): Promise<Restaurant> {
    const { restaurant } = await this.client.delete(
      `restaurants/${id}`,
      this.user?.token
    )
    return restaurant
  }
}
