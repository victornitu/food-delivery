import { Request, Response } from 'express'
import passport from 'passport'
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Env } from '../env'
import { getter } from '../utils'
import { Repository } from './repository'
import { HttpServices } from '../services'

export class Services extends HttpServices {
  readonly passport = passport
  readonly repo: Repository
  readonly salt: number
  readonly secret: string

  constructor (env: Env) {
    super()
    this.salt = env.auth.salt
    this.secret = env.auth.secret
    this.passport.use(this.strategy)
    this.repo = new Repository(env.database)
    this.get('/:name', this.find)
    this.post('/register', this.register)
    this.post('/login', this.authenticate)
  }

  get strategy (): Strategy {
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.secret
    }
    return new Strategy(options, this.verify.bind(this))
  }

  async verify (payload: any, next: VerifiedCallback) {
    const get = getter(payload)
    try {
      const name: string = get('name')
      const user = await this.repo.find({ name })
      if (user) {
        next(null, user)
      } else {
        next(null, false)
      }
    } catch (e) {
      next(e, false)
    }
  }

  async authenticate (req: Request, res: Response) {
    const get = getter(req.body)
    const [name, pass]: [string, string] = [get('username'), get('password')]
    const user = await this.repo.find({ name })
    if (!user) {
      res.status(401)
      res.json({ message: 'invalid username' })
      return
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      res.status(401)
      res.json({ message: 'invalid password' })
      return
    }
    const payload = {
      id: user.id,
      name: user.username,
      roles: user.roles
    }
    const token = jwt.sign(payload, this.secret)
    res.json({ token })
  }

  async register (req: Request, res: Response) {
    const get = getter(req.body)
    const pass = get('password')
    if (pass !== get('confirmation')) {
      res.status(400)
      res.json({ message: 'password does not match' })
      return
    }
    const user = await this.repo.register({
      username: get<string>('username'),
      password: await bcrypt.hash(pass, this.salt),
      role: get<string>('role')
    })
    res.status(201)
    res.json({ user })
  }

  async find (req: Request, res: Response) {
    const { name } = req.params
    const user = await this.repo.find({ name })
    res.json({ user })
  }
}
