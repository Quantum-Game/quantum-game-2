export interface RootState {
  currentLevel: {
    number?: number,
    boardDimensions: {
      x?: number,
      y?: number,
    },
    cells: { x: number, y: number, element: string, rotation: number, frozen: boolean}[],
    availableTools: Array<[string, number]>,
  },
}

export interface ICell {
  x: number,
  y: number,
  originX: number,
  originY: number,
  rotation: number,
  element: string,
}