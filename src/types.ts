export interface RootState {
  currentLevel: {
    number?: number,
    boardDimensions: {
      x?: number,
      y?: number,
    },
    elementPositions: any[][],
    cells: { x: number, y: number, element: string, rotation: number, frozen: boolean}[],
    availableTools: Array<[string, number]>,
  }
}
