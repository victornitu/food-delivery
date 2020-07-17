import { v4 } from 'uuid'
import { Record, Store } from '../store'
import { Restaurant, RestaurantStatus } from '../models'
import { Read, Restaurant as Request, Settings } from '../requests'
import { read, create, update, change } from './queries'

export class Repository {
  readonly store: Store<Restaurant>

  constructor (settings: Settings) {
    this.store = new Store(settings, extract)
  }

  async read ({ page, limit }: Read): Promise<Array<Restaurant>> {
    const params = {
      skip: limit * (page - 1),
      limit: limit,
      status: RestaurantStatus.Open
    }
    return this.store.execute(read, params)
  }

  async create (r: Request): Promise<Restaurant> {
    const params = {
      u_id: r.owner,
      r_id: v4(),
      r_name: r.name,
      r_description: r.description,
      r_status: RestaurantStatus.Open
    }
    const [res] = await this.store.execute(create, params)
    return res
  }

  async update (id: string, r: Request): Promise<Restaurant> {
    const params = {
      u_id: r.owner,
      r_id: id,
      r_name: r.name,
      r_description: r.description
    }
    const [res] = await this.store.execute(update, params)
    return res
  }

  async archive (owner: string, id: string): Promise<Restaurant> {
    const params = {
      u_id: owner,
      r_id: id,
      r_status: RestaurantStatus.Closed
    }
    const [res] = await this.store.execute(change, params)
    return res
  }
}

function extract (r: Record): Restaurant {
  const getRestaurant = r.getter('r')
  const getUser = r.getter('u')
  return {
    id: getRestaurant('id'),
    name: getRestaurant('name'),
    description: getRestaurant('description'),
    status: getRestaurant('status') as RestaurantStatus,
    owner: {
      id: getUser('id'),
      username: getUser('username'),
      password: '',
      roles: []
    }
  }
}
