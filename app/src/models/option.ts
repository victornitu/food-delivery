export interface Option<T> {
  isDefined: boolean
  map<A>(f: (t: T) => A): Option<A>
  get(): T
  getOrElse(t: T): T
}

export class Some<T> implements Option<T> {
  readonly isDefined = true

  constructor (readonly val: T) {}

  get (): T {
    return this.val
  }
  getOrElse (t: T): T {
    return this.val
  }
  map<A> (f: (t: T) => A): Option<A> {
    return new Some(f(this.val))
  }
}

export class None<T> implements Option<T> {
  readonly isDefined = false

  get (): T {
    throw new Error('None is not a value')
  }
  getOrElse (t: T): T {
    return t
  }
  map<A> (f: (t: T) => A): Option<A> {
    return new None<A>()
  }
}
