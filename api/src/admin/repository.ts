import { v4 } from 'uuid'
import { Store } from '../store'
import { Settings } from '../requests'
import { Permission } from '../models'
import { constraints, role } from './queries'

const roles = [
  {
    id: v4(),
    name: 'Customer',
    permissions: [Permission.PlaceOrder]
  },
  {
    id: v4(),
    name: 'Owner',
    permissions: [
      Permission.HandleOrder,
      Permission.ManageRestaurant,
      Permission.ManageMeal
    ]
  }
]

export class Repository {
  readonly store: Store<void>

  constructor (settings: Settings) {
    this.store = new Store(settings, extract)
  }

  async init (): Promise<void> {
    for (const constraint of constraints) {
      await this.store.run([constraint])
    }
    await Promise.all(roles.map(r => this.store.run(role, r)))
  }
}

function extract () {}
