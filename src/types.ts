export interface RootState {
  currentLevel: {
    number?: number,
    boardDimensions: {
      x?: number,
      y?: number,
    },
    elementPositions: any[][],
  }
  // dimensions?: {x: number; y: number}
  // boardState: {rows: string[][]}
}
