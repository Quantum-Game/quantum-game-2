export interface RootState {
  currentLevel: {
    number?: number,
    boardDimensions: {
      x?: number,
      y?: number,
    },
    cells: { x: number, y: number, element: string, rotation: number, frozen: boolean}[],
    availableTools: Array<[string, number]>,
  }
}
