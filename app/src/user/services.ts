import { decode } from 'jsonwebtoken'
import { Client } from 'app/client'
import { Permission, Server, User, Role } from 'models'
import { getter } from 'app/utils'
import { Storage } from 'app/storage'

export interface LoginRequest {
  username: string
  password: string
}

export interface SignupRequest {
  username: string
  password: string
  confirmation: string
  role: string
}

export class Services {
  readonly client: Client
  readonly storage = new Storage()

  constructor (server: Server) {
    this.client = new Client(server)
  }

  async roles (): Promise<Array<Role>> {
    const { roles } = await this.client.get('roles')
    return roles
  }

  async login (request: LoginRequest): Promise<User> {
    const { token } = await this.client.post('users/login', request)
    const user = decode(token)
    if (!user || typeof user === 'string') {
      throw new Error('invalid token')
    }
    const get = getter(user)
    const roles: Array<Role> = get('roles')
    const result: User = {
      id: get('id'),
      name: get('name'),
      permissions: roles.reduce(combinePermissions, []),
      token
    }
    this.storage.saveUser(result)
    return result
  }

  async signup (request: SignupRequest): Promise<User> {
    await this.client.post('users/register', request)
    return this.login(request)
  }

  async logout (): Promise<void> {
    this.storage.removeUser()
  }
}

function combinePermissions (
  acc: Array<Permission>,
  role: Role
): Array<Permission> {
  return [...acc, ...role.permissions]
}
