import { None, Option, Some, User } from '../models'

export class Storage {
  readonly key = 'FOOD_DELIVERY'

  get userKey (): string {
    return `${this.key}_USER`
  }

  saveUser (user: User) {
    const serialized = JSON.stringify(user)
    localStorage.setItem(this.userKey, serialized)
  }

  getUser (): Option<User> {
    const serialized = localStorage.getItem(this.userKey)
    if (!serialized) {
      return new None()
    }
    const user: User = JSON.parse(serialized)
    return new Some(user)
  }

  removeUser () {
    localStorage.removeItem(this.userKey)
  }
}
