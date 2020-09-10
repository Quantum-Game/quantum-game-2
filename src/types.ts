// TODO: we might make this interface more explicit by listing
// a subset of CSS properties directly to avoid typos.
export interface IStyle {
  [k: string]: string | undefined
}

/**
 * Determines whether an object has a property with the specified key value.
 * That information is preserved on the type level.
 */
export function hasKey<O>(obj: O, key: string | symbol | number): key is keyof O {
  return key in obj
}

/**
 * Determines whether an object has a property with the specified key value and runtime type.
 */
export function hasKeyType<O>(obj: O, key: string | symbol | number, typename: string): boolean {
  return hasKey(obj, key) && typeof obj[key] === typename
}

export function hasKeyInstance<O>(
  obj: O,
  key: string | symbol | number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  klass: { new (...args: any[]): unknown }
): boolean {
  return hasKey(obj, key) && obj[key] instanceof klass
}
