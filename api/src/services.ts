import express, { Request, RequestHandler, Response, Router } from 'express'

interface HttpService {
  (req: Request, res: Response): void
}

export abstract class HttpServices {
  readonly router: Router

  constructor () {
    this.router = express.Router()
  }

  protected get (path: string, service: HttpService, auth?: RequestHandler) {
    auth
      ? this.router.get(path, auth, this.call(service))
      : this.router.get(path, this.call(service))
  }

  protected post (path: string, service: HttpService, auth?: RequestHandler) {
    auth
      ? this.router.post(path, auth, this.call(service))
      : this.router.post(path, this.call(service))
  }

  protected put (path: string, service: HttpService, auth?: RequestHandler) {
    auth
      ? this.router.put(path, auth, this.call(service))
      : this.router.put(path, this.call(service))
  }

  protected delete (path: string, service: HttpService, auth?: RequestHandler) {
    auth
      ? this.router.delete(path, auth, this.call(service))
      : this.router.delete(path, this.call(service))
  }

  private call (service: HttpService) {
    service = service.bind(this)
    return async function (req: Request, res: Response) {
      try {
        await service(req, res)
      } catch ({message}) {
        console.error(message)
        res.status(500)
        res.json({message})
      }
    }
  }
}
