import { v4 } from 'uuid'
import { Record, Store } from '../store'
import { Meal, MealStatus } from '../models'
import { Read, Settings, Meal as Request } from '../requests'
import { create, read, update, change } from './queries'

export class Repository {
  readonly store: Store<Meal>

  constructor (settings: Settings) {
    this.store = new Store(settings, extract)
  }

  async read (id: string, { page, limit }: Read): Promise<Array<Meal>> {
    const skip = limit * (page - 1)
    const status = MealStatus.Available
    const params = { id, status, skip, limit }
    return this.store.execute(read, params)
  }

  async create (r: Request): Promise<Meal> {
    const params = {
      u_id: r.owner,
      r_id: r.restaurant,
      m_id: v4(),
      m_name: r.name,
      m_description: r.description,
      m_price: r.price,
      m_status: MealStatus.Available
    }
    const [res] = await this.store.execute(create, params)
    return res
  }

  async update (id: string, r: Request): Promise<Meal> {
    const params = {
      u_id: r.owner,
      r_id: r.restaurant,
      m_id: id,
      m_name: r.name,
      m_description: r.description,
      m_price: r.price
    }
    const [res] = await this.store.execute(update, params)
    return res
  }

  async archive (
    owner: string,
    restaurant: string,
    meal: string
  ): Promise<Meal> {
    const params = {
      u_id: owner,
      r_id: restaurant,
      m_id: meal,
      m_status: MealStatus.OutOfStock
    }
    const [res] = await this.store.execute(change, params)
    return res
  }
}

function extract (r: Record): Meal {
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
