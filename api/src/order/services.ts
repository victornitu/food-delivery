import { Request, RequestHandler, Response } from 'express'
import { HttpServices } from '../services'
import { Repository } from './repository'
import { Env } from '../env'
import { Order, OrderStatus, Permission, Role, User } from '../models'
import { getter } from '../utils'

export class Services extends HttpServices {
  readonly repo: Repository

  constructor (env: Env, auth: RequestHandler) {
    super()
    this.repo = new Repository(env.database)
    this.get('/', this.read, auth)
    this.post('/', this.place, auth)
    this.delete('/:id', this.cancel, auth)
    this.put('/:id/process', this.process, auth)
    this.put('/:id/in-route', this.inRoute, auth)
    this.put('/:id/delivered', this.deliver, auth)
    this.put('/:id/received', this.receive, auth)
  }

  async read (req: Request, res: Response) {
    const { id, roles } = req.user as User
    const permissions = roles.reduce(mergePermissions, [])
    let orders: Array<Order> = []
    if (permissions.includes(Permission.PlaceOrder)) {
      orders = orders.concat(await this.repo.customer(id))
    }
    if (permissions.includes(Permission.HandleOrder)) {
      orders = orders.concat(await this.repo.owner(id))
    }
    res.json({
      orders: await Promise.all(orders.map(o => this.repo.meals(o)))
    })
  }

  async place (req: Request, res: Response) {
    const { id, roles } = req.user as User
    const get = getter(req.body)
    const permissions = roles.reduce(mergePermissions, [])
    if (!permissions.includes(Permission.PlaceOrder)) {
      res.status(401)
      res.json({ message: 'required permission missing' })
      return
    }
    const order = await this.repo.create({
      owner: id,
      restaurant: get('restaurant'),
      meals: get('meals')
    })
    res.status(201)
    res.json({ order })
  }

  async cancel (req: Request, res: Response) {
    const { id: customer, roles } = req.user as User
    const { id } = req.params
    const permissions = roles.reduce(mergePermissions, [])
    if (!permissions.includes(Permission.PlaceOrder)) {
      res.status(401)
      res.json({ message: 'required permission missing' })
      return
    }
    res.json({
      order: await this.repo.update({
        user: customer,
        order: id,
        previous: OrderStatus.Placed,
        next: OrderStatus.Canceled
      })
    })
  }

  async process (req: Request, res: Response) {
    const { id: owner, roles } = req.user as User
    const { id } = req.params
    const permissions = roles.reduce(mergePermissions, [])
    if (!permissions.includes(Permission.HandleOrder)) {
      res.status(401)
      res.json({ message: 'required permission missing' })
      return
    }
    res.json({
      order: await this.repo.manage({
        user: owner,
        order: id,
        previous: OrderStatus.Placed,
        next: OrderStatus.Processing
      })
    })
  }

  async inRoute (req: Request, res: Response) {
    const { id: owner, roles } = req.user as User
    const { id } = req.params
    const permissions = roles.reduce(mergePermissions, [])
    if (!permissions.includes(Permission.HandleOrder)) {
      res.status(401)
      res.json({ message: 'required permission missing' })
      return
    }
    res.json({
      order: await this.repo.manage({
        user: owner,
        order: id,
        previous: OrderStatus.Processing,
        next: OrderStatus.InRoute
      })
    })
  }

  async deliver (req: Request, res: Response) {
    const { id: owner, roles } = req.user as User
    const { id } = req.params
    const permissions = roles.reduce(mergePermissions, [])
    if (!permissions.includes(Permission.HandleOrder)) {
      res.status(401)
      res.json({ message: 'required permission missing' })
      return
    }
    res.json({
      order: await this.repo.manage({
        user: owner,
        order: id,
        previous: OrderStatus.InRoute,
        next: OrderStatus.Delivered
      })
    })
  }

  async receive (req: Request, res: Response) {
    const { id: customer, roles } = req.user as User
    const { id } = req.params
    const permissions = roles.reduce(mergePermissions, [])
    if (!permissions.includes(Permission.PlaceOrder)) {
      res.status(401)
      res.json({ message: 'required permission missing' })
      return
    }
    res.json({
      order: await this.repo.update({
        user: customer,
        order: id,
        previous: OrderStatus.Delivered,
        next: OrderStatus.Received
      })
    })
  }
}

function mergePermissions (
  acc: Array<Permission>,
  role: Role
): Array<Permission> {
  return [...acc, ...role.permissions]
}
