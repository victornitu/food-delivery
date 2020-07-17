import { Request, Response } from 'express'
import { HttpServices } from '../services'
import { Env } from '../env'
import { Repository } from './repository'

export class Services extends HttpServices {
  readonly repo: Repository
  readonly secret: string

  constructor (env: Env) {
    super()
    this.secret = env.admin.secret
    this.repo = new Repository(env.database)
    this.post('/', this.init)
  }

  async init (req: Request, res: Response) {
    const { token } = req.body
    if (token !== this.secret) {
      res.status(401)
      res.json({ message: 'unauthorized' })
      return
    }
    await this.repo.init()
    res.status(201)
    res.json({ message: 'success' })
  }
}
