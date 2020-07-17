import { ChangeEvent } from 'react'

declare type HTMLElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement

export function call (set: (s: string) => void) {
  return function ({ target }: ChangeEvent<HTMLElement>) {
    return set(target.value)
  }
}

export function callInt (set: (s: number) => void) {
  return function ({ target }: ChangeEvent<HTMLElement>) {
    return set(parseInt(target.value))
  }
}

export declare type Parameters = {
  [key: string]: any
}

export function getter (obj: Parameters) {
  return function<T> (key: string, alt?: T): T {
    return obj[key] || alternative(key, alt)
  }
}

function alternative<T> (name: string, alt: T | undefined): T {
  if (!alt) {
    throw new Error(`missing field ${name}`)
  }
  return alt
}
