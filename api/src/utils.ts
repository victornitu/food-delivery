import {Parameters} from './requests'

export function getter(obj: Parameters) {
  return function <T>(key: string, alt?: T): T {
    return obj[key] || alternative(key, alt)
  }
}

export function integerGetter (obj: Parameters) {
  return function (key: string, alt?: number): number {
    return parseInt(obj[key] || alternative(key, alt)) || alternative(key, alt)
  }
}

function alternative<T>(name: string, alt: T | undefined): T {
  if (!alt) {
    throw new Error(`missing field ${name}`)
  }
  return alt
}
