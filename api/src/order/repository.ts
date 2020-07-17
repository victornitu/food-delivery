import { Basket, Meal, MealStatus, Order, OrderStatus } from '../models'
import { Record, Store } from '../store'
import { Settings, Order as Request, Update } from '../requests'
import {
  customer,
  meal,
  owner,
  read,
  create,
  link,
  update,
  manage
} from './queries'
import { v4 } from 'uuid'

interface Stores {
  order: Store<Order>
  basket: Store<Basket>
  meal: Store<Meal>
}

export class Repository {
  readonly stores: Stores

  constructor (settings: Settings) {
    this.stores = {
      order: new Store(settings, extract.order),
      basket: new Store(settings, extract.basket),
      meal: new Store(settings, extract.meal)
    }
  }

  async customer (id: string): Promise<Array<Order>> {
    return this.stores.order.execute(customer, { id })
  }

  async owner (id: string): Promise<Array<Order>> {
    return this.stores.order.execute(owner, { id })
  }

  async meals (order: Order): Promise<Order> {
    const { id } = order
    const meals = await this.stores.basket.execute(meal, { id })
    return { ...order, meals }
  }

  async create (r: Request): Promise<Order> {
    const meals = await this.stores.meal.execute(read, {
      r_id: r.restaurant,
      m_ids: r.meals.map(m => m.meal)
    })
    if (meals.length !== r.meals.length) {
      throw new Error('invalid meals ordered')
    }
    const amounts = r.meals.reduce(classify, {})
    const total = meals.reduce(sumify(amounts), 0)
    const params = {
      r_id: r.restaurant,
      u_id: r.owner,
      o_id: v4(),
      o_status: OrderStatus.Placed,
      o_total: total
    }
    const [order] = await this.stores.order.execute(create, params)
    await Promise.all(
      meals.map(m =>
        this.stores.order.run(link, {
          o_id: order.id,
          m_id: m.id,
          m_price: m.price,
          m_amount: amounts[m.id]
        })
      )
    )
    return {
      ...order,
      total,
      meals: meals.map(m => ({ meal: m, amount: amounts[m.id] }))
    }
  }

  async update (r: Update): Promise<Order> {
    const [order] = await this.stores.order.execute(update, {
      u_id: r.user,
      o_id: r.order,
      o_status: r.previous,
      o_next: r.next
    })
    return order
  }

  async manage (r: Update): Promise<Order> {
    const [order] = await this.stores.order.execute(manage, {
      u_id: r.user,
      o_id: r.order,
      o_status: r.previous,
      o_next: r.next
    })
    return order
  }
}

function classify (
  acc: { [id: string]: number },
  { meal, amount }: { meal: string; amount: number }
): { [id: string]: number } {
  return { ...acc, [meal]: amount }
}

function sumify (amount: { [id: string]: number }) {
  return function (
    total: number,
    { id, price }: { id: string; price: number }
  ): number {
    return total + amount[id] * price
  }
}

const extract = {
  order: function (r: Record): Order {
    const user = r.getter('u')
    const order = r.getter('o')
    const restaurant = r.getter('r')
    const owner = r.getter('a')
    return {
      id: order('id'),
      date: order('date'),
      status: order('status'),
      total: order('total'),
      customer: {
        id: user('id'),
        username: user('username'),
        roles: [],
        password: ''
      },
      restaurant: {
        id: restaurant('id'),
        name: restaurant('name'),
        description: restaurant('description'),
        status: restaurant('status'),
        owner: {
          id: owner('id'),
          username: owner('username'),
          roles: [],
          password: ''
        }
      },
      meals: []
    }
  },
  basket: function (r: Record): Basket {
    const getMeal = r.getter('m')
    const getContains = r.getter('c')
    return {
      meal: {
        id: getMeal('id'),
        name: getMeal('name'),
        description: getMeal('description'),
        price: getContains('price'),
        status: MealStatus.Available
      },
      amount: getContains('amount')
    }
  },
  meal: function (r: Record): Meal {
    const getMeal = r.getter('m')
    const getServes = r.getter('s')
    return {
      id: getMeal('id'),
      name: getMeal('name'),
      description: getMeal('description'),
      price: getServes('price'),
      status: getServes('status')
    }
  }
}
