import express, {
  Express,
  Request,
  RequestHandler,
  Response,
  NextFunction
} from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { getEnv, Env } from './env'

import { Services as AdminServices } from './admin'
import { Services as RoleServices } from './role'
import { Services as UserServices } from './user'
import { Services as RestaurantServices } from './restaurant'
import { Services as MealServices } from './meal'
import { Services as OrderServices } from './order'

interface HttpError {
  status: number
  message: string
}

class App {
  readonly app: Express
  readonly admin: AdminServices
  readonly users: UserServices
  readonly roles: RoleServices
  readonly restaurants: RestaurantServices
  readonly meals: MealServices
  readonly orders: OrderServices

  constructor (readonly env: Env) {
    this.app = express()
    this.admin = new AdminServices(this.env)
    this.users = new UserServices(this.env)
    this.roles = new RoleServices(this.env)
    this.restaurants = new RestaurantServices(this.env, this.auth)
    this.meals = new MealServices(this.env, this.auth)
    this.orders = new OrderServices(this.env, this.auth)
  }

  start () {
    this.app
      .use(express.json())
      .use(cors())
      .use(morgan(this.env.logger.format))
      .use(this.users.passport.initialize())
      .get('/', this.status)
      .use('/admin', this.admin.router)
      .use('/roles', this.roles.router)
      .use('/users', this.users.router)
      .use('/restaurants', this.restaurants.router)
      .use('/meals', this.meals.router)
      .use('/orders', this.orders.router)
      .use(this.error)
      .use(this.unknown)
    this.app.listen(this.env.server.port, this.bootstrap.bind(this))
  }

  get auth (): RequestHandler {
    return this.users.passport.authenticate('jwt', {session: false})
  }

  status (req: Request, res: Response) {
    res.json({status: 'running'})
  }

  error (err: HttpError, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
      return next(err)
    }
    res.status(err.status || 500)
    res.json({ message: err.message })
  }

  unknown (req: Request, res: Response) {
    res.status(404)
    res.json({ message: 'not found' })
  }

  bootstrap () {
    console.log(`Server running on port ${this.env.server.port}`)
  }
}

function main () {
  const env = getEnv()
  const app = new App(env)
  app.start()
}

main()
