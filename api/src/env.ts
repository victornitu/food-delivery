import { getter, integerGetter } from './utils'

interface Admin {
  secret: string
}

interface Auth {
  salt: number
  secret: string
}

interface Database {
  host: string
  port: number
  user: string
  pass: string
}

interface Logger {
  format: string
}

interface Server {
  port: number
}

export interface Env {
  admin: Admin
  auth: Auth
  database: Database
  logger: Logger
  server: Server
}

const get = getter(process.env)
const getInt = integerGetter(process.env)

export function getEnv (): Env {
  return {
    admin: {
      secret: get('ADMIN_SECRET')
    },
    auth: {
      salt: getInt('AUTH_SALT', 10),
      secret: get('AUTH_SECRET')
    },
    database: {
      host: get('DB_HOST', 'localhost'),
      port: getInt('DB_PORT', 7687),
      user: get('BD_USER', 'neo4j'),
      pass: get('DB_PASS', 'test')
    },
    logger: {
      format: get('LOGGER_FORMAT', 'tiny')
    },
    server: {
      port: getInt('SERVER_PORT', 80),
    }
  }
}
