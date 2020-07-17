import { Meal, Restaurant, Server, User } from 'models'
import { Client } from 'app/client'

interface CreateRequest {
  name: string
  description: string
  price: number
}

export class Services {
  readonly client: Client

  constructor (server: Server, readonly restaurant: Restaurant, readonly user?: User) {
    this.client = new Client(server)
  }

  async create (request: CreateRequest): Promise<Meal> {
    const { meal } = await this.client.post(`meals/${this.restaurant.id}`, request, this.user?.token)
    return meal
  }

  async delete (id: string): Promise<Meal> {
    const { meal } = await this.client.delete(`meals/${this.restaurant.id}/${id}`, this.user?.token)
    return meal
  }
}
