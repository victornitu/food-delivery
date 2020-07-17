import { Request, Response, RequestHandler } from 'express'
import { Env } from '../env'
import { integerGetter, getter } from '../utils'
import { Repository } from './repository'
import { HttpServices } from '../services'
import { User } from '../models'

export class Services extends HttpServices {
  readonly repo: Repository

  constructor (env: Env, auth: RequestHandler) {
    super()
    this.repo = new Repository(env.database)
    this.get('/', this.read)
    this.post('/', this.create, auth)
    this.put('/:id', this.update, auth)
    this.delete('/:id', this.archive, auth)
  }

  async read (req: Request, res: Response) {
    const get = integerGetter(req.query)
    const page = {
      page: get('page', 1),
      limit: get('limit', 20)
    }
    const restaurants = await this.repo.read(page)
    res.json({ restaurants, ...page })
  }

  async create (req: Request, res: Response) {
    const { id: owner } = req.user as User
    const get = getter(req.body)
    const restaurant = await this.repo.create({
      name: get('name'),
      description: get('description'),
      owner
    })
    res.status(201)
    res.json({ restaurant })
  }

  async update (req: Request, res: Response) {
    const { id } = req.params
    const { id: owner } = req.user as User
    const get = getter(req.body)
    const restaurant = await this.repo.update(id, {
      name: get('name'),
      description: get('description'),
      owner
    })
    res.json({ restaurant })
  }

  async archive (req: Request, res: Response) {
    const { id } = req.params
    const { id: owner } = req.user as User
    const restaurant = await this.repo.archive(owner, id)
    res.json({ restaurant })
  }
}
