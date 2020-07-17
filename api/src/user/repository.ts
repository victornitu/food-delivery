import { v4 } from 'uuid'
import { User } from '../models'
import { Filter, Settings, User as Request } from '../requests'
import { Record, Store } from '../store'
import { find, register } from './queries'

export class Repository {
  readonly store: Store<User>

  constructor (settings: Settings) {
    this.store = new Store(settings, extract)
  }

  async find ({ name }: Filter): Promise<User> {
    const params = { name }
    const [res] = await this.store.execute(find, params)
    return res
  }

  async register (u: Request): Promise<User> {
    const params = {
      r_id: u.role,
      u_id: v4(),
      u_name: u.username,
      u_pass: u.password
    }
    const [res] = await this.store.execute(register, params)
    return res
  }
}

function extract (r: Record): User {
  const getUser = r.getter('u')
  const getRole = r.getter('r')
  return {
    id: getUser('id'),
    username: getUser('username'),
    password: getUser('password'),
    roles: [
      {
        id: getRole('id'),
        name: getRole('name'),
        permissions: getRole('permissions')
      }
    ]
  }
}
