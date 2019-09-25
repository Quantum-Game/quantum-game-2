export interface RootState {
  currentLevel: {
    number?: number,
    boardDimensions: {
      x?: number,
      y?: number,
    },
    elementPositions: any[][],
    availableTools: Array<[string, number]>,
  }
  // dimensions?: {x: number; y: number}
  // boardState: {rows: string[][]}
}
