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
