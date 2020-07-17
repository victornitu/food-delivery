import { Server } from 'models'

export class Client {
  readonly baseUrl: string

  constructor ({ protocol, host, port }: Server) {
    this.baseUrl = `${protocol}://${host}:${port}`
  }

  async get<T> (url: string, token?: string): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const target = `${this.baseUrl}/${url}`
    const options = { method: 'GET', headers }
    return fetch(target, options).then(validateResponse)
  }

  async post<X, Y> (url: string, req: X, token?: string): Promise<Y> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const target = `${this.baseUrl}/${url}`
    const body = JSON.stringify(req)
    const options = { method: 'POST', headers, body }
    return fetch(target, options).then(validateResponse)
  }

  async put<X, Y> (url: string, req: X, token?: string): Promise<Y> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const target = `${this.baseUrl}/${url}`
    const body = JSON.stringify(req)
    const options = { method: 'PUT', headers, body }
    return fetch(target, options).then(validateResponse)
  }

  async delete<T> (url: string, token?: string): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const target = `${this.baseUrl}/${url}`
    const options = { method: 'DELETE', headers }
    return fetch(target, options).then(validateResponse)
  }
}

async function validateResponse (response: Response) {
  if (!response.ok) {
    const { message } = await response.json()
    throw new Error(message)
  }
  return response.json()
}
