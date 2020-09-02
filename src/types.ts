// TODO: we might make this interface more explicit by listing
// a subset of CSS properties directly to avoid typos.
export interface IStyle {
  [k: string]: string | undefined
}
