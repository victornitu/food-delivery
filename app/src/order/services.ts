import { Client } from '../app/client'
import { Order, Server, User } from '../models'

export class Services {
  readonly client: Client

  constructor (server: Server, readonly user: User) {
    this.client = new Client(server)
  }

  async read (): Promise<Array<Order>> {
    const { orders } = await this.client.get('orders', this.user.token)
    return orders
  }

  async cancel (id: string): Promise<Order> {
    const { order } = await this.client.delete(`orders/${id}`, this.user.token)
    return order
  }

  async process (id: string): Promise<Order> {
    const { order } = await this.client.put(
      `orders/${id}/process`,
      {},
      this.user.token
    )
    return order
  }

  async inRoute (id: string): Promise<Order> {
    const { order } = await this.client.put(
      `orders/${id}/in-route`,
      {},
      this.user.token
    )
    return order
  }

  async deliver (id: string): Promise<Order> {
    const { order } = await this.client.put(
      `orders/${id}/delivered`,
      {},
      this.user.token
    )
    return order
  }

  async receive (id: string): Promise<Order> {
    const { order } = await this.client.put(
      `orders/${id}/received`,
      {},
      this.user.token
    )
    return order
  }
}
