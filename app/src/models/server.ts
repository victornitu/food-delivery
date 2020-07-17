export interface Server {
  protocol: Protocol
  host: string
  port: number
}

export enum Protocol {
  Http = 'http',
  Https = 'https'
}

export interface Read {
  page: number
  limit: number
}
