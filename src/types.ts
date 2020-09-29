// TODO: we might make this interface more explicit by listing
// a subset of CSS properties directly to avoid typos.
export interface IStyle {
  [k: string]: string | undefined
}

type Key = PropertyKey
type Obj = Record<Key, unknown>

/**
 * Determines whether an object has a property with the specified key value.
 * That information is preserved on the type level.
 */
export function hasProperty<X extends Obj, Y extends Key>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return Object.hasOwnProperty.call(obj, prop)
}

export function tryGetBool<X extends Obj, Y extends Key>(obj: X, key: Y): boolean | null {
  if (hasProperty(obj, key)) {
    const prop = obj[key]
    if (typeof prop === 'boolean') {
      return prop
    }
  }
  return null
}

export function isObject(value: unknown): value is Obj {
  return typeof value === 'object' && value != null
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function tryGetProp<X extends Obj, Y extends Key>(obj: X, key: Y): unknown {
  return hasProperty(obj, key) ? obj[key] : null
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function tryGetNumber<X extends Obj, Y extends Key>(obj: X, key: Y): number | null {
  const prop = tryGetProp(obj, key)
  return typeof prop === 'number' ? prop : null
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function tryGetString<X extends Obj, Y extends Key>(obj: X, key: Y): string | null {
  const prop = tryGetProp(obj, key)
  return typeof prop === 'string' ? prop : null
}

export function tryGetInstance<X extends Obj, Y extends Key, T>(
  obj: X,
  key: Y,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  klass: { new (...args: any): T }
): T | null {
  const prop = tryGetProp(obj, key)
  return typeof prop === 'object' && prop instanceof klass ? prop : null
}

export function tryGetObject<X extends Obj, Y extends Key>(obj: X, key: Y): Obj | null {
  const prop = tryGetProp(obj, key)
  return isObject(prop) ? prop : null
}

export function isInteger(value: unknown): value is number {
  return Number.isInteger(value)
}

export function isDef<T>(val: T | null | undefined): val is T {
  return val != null
}

export function isNotString<T>(val: T | string): val is T {
  return typeof val !== 'string'
}

export function assertUnreachable(_: never): never {
  throw new Error('Unreachable')
}

/**
 * Declare the event type in `emits` declaration.
 *
 * warning: Only for static typing, doesn't actually provide any runtime validation.
 */
export function emitType<T>(): (_: T) => true {
  return () => true
}
