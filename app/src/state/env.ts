import { Protocol, Server } from 'models'

interface Env {
  server: Server
}

export function getEnv (): Env {
  return {
    server: {
      protocol: Protocol.Http,
      host: 'localhost',
      port: 8082
    }
  }
}
