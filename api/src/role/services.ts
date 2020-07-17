import { Request, Response } from 'express'
import { Env } from '../env'
import { Repository } from './repository'
import { HttpServices } from '../services'

export class Services extends HttpServices {
  readonly repo: Repository

  constructor (env: Env) {
    super()
    this.repo = new Repository(env.database)
    this.get('/', this.read)
  }

  async read (req: Request, res: Response) {
    const roles = await this.repo.read()
    res.json({ roles })
  }
}
