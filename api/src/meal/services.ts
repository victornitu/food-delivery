import { Request, RequestHandler, Response } from 'express'
import { Env } from '../env'
import { getter, integerGetter } from '../utils'
import { Repository } from './repository'
import { HttpServices } from '../services'
import { User } from '../models'

export class Services extends HttpServices {
  readonly repo: Repository

  constructor (env: Env, auth: RequestHandler) {
    super()
    this.repo = new Repository(env.database)
    this.get('/:restaurant', this.read)
    this.post('/:restaurant', this.create, auth)
    this.put('/:restaurant/:id', this.update, auth)
    this.delete('/:restaurant/:id', this.archive, auth)
  }

  async read (req: Request, res: Response) {
    const { restaurant } = req.params
    const get = integerGetter(req.query)
    const page = {
      page: get('page', 1),
      limit: get('limit', 20)
    }
    const meals = await this.repo.read(restaurant, page)
    res.json({ meals, ...page })
  }

  async create (req: Request, res: Response) {
    const { restaurant } = req.params
    const { id: owner } = req.user as User
    const get = getter(req.body)
    const meal = await this.repo.create({
      name: get('name'),
      description: get('description'),
      price: get('price'),
      restaurant,
      owner
    })
    res.status(201)
    res.json({ meal })
  }

  async update (req: Request, res: Response) {
    const { restaurant, id } = req.params
    const { id: owner } = req.user as User
    const get = getter(req.body)
    const meal = await this.repo.update(id, {
      name: get('name'),
      description: get('description'),
      price: get('price'),
      restaurant,
      owner
    })
    res.json({ meal })
  }

  async archive (req: Request, res: Response) {
    const { restaurant, id } = req.params
    const { id: owner } = req.user as User
    const meal = await this.repo.archive(owner, restaurant, id)
    res.json({ meal })
  }
}
