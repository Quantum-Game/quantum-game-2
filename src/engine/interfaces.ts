/**
 * GRID INTERFACE
 * Grid interface in primitives
 */
export interface IGrid {
  cols: number
  rows: number
  cells: ICell[]
}
/**
 * CELL SIM INTERFACE (JSON format needs to be discussed)
 * A cell interface composed of primitives
 */

/**
 * CELL INTERFACE
 * A cell interface composed of primitives
 */
export interface ICell {
  coord: ICoord
  element: string
  frozen: boolean
  rotation?: number
  polarization?: number
  percentage?: number
  active?: boolean
  energized?: boolean
}

/**
 * COORDINATE INTERFACE
 * A coordinates interface of primitives
 */
export interface ICoord {
  x: number
  y: number
}

/**
 * ENCYCLOPEDIA ENTRY LIST INTERFACE
 * Encyclopedia entry list in primitives
 */
export interface IEntryList {
  [index: string]: IEntry
}

/**
 * ENCYCLOPEDIA ENTRY INTERFACE
 * Encyclopedia entry interface in primitives
 */
export interface IEntry {
  title: string
  elementName: string
  short: string
  grids: IGrid[]
  sections: IEntrySection[]
}

/**
 * ENCYCLOPEDIA ENTRY SECTION INTERFACE
 * Encyclopedia entry section interface
 */
export interface IEntrySection {
  title: string
  content?: string
  pics?: string[]
}
