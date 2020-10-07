/**
 * ENCYCLOPEDIA GRID INTERFACE
 * Grid interface for encyclopedia board
 */
export interface IGrid {
  cols: number
  rows: number
  cells: {
    coord: { x: number; y: number }
    element: string
    frozen: boolean
    rotation?: number
    polarization?: number
    percentage?: number
    active?: boolean
    energized?: boolean
  }[]
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
