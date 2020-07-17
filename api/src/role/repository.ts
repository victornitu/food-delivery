import { Role } from 'models'
import { Record, Store } from '../store'
import { Settings } from '../requests'
import { read } from './queries'

export class Repository {
  readonly store: Store<Role>

  constructor (settings: Settings) {
    this.store = new Store(settings, extract)
  }

  async read (): Promise<Array<Role>> {
    return this.store.execute(read)
  }
}

function extract (r: Record): Role {
  const getRole = r.getter('r')
  return {
    id: getRole('id'),
    name: getRole('name'),
    permissions: getRole('permissions')
  }
}
