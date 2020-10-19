import { computed, proxyRefs, ref } from 'vue'
import {
  importLevel,
  exportLevel,
  Level,
  runSimulation,
  Simulation,
  Coord,
  Vector,
  PieceFlags,
  hasFlags,
} from '@/engine/model'
import { nextElementRotation } from '@/engine/elements'

export const enum SimulationVisType {
  Laser,
  QuantumWave,
  Experiment,
}

export function gameController(options?: {
  initialState?: () => Vector | undefined
  maxSteps?: () => number | undefined
}): GameController {
  const level = ref<Level>()
  const sim = computed(() =>
    level.value != null
      ? runSimulation(
          level.value.board,
          options?.maxSteps?.() ?? 40,
          options?.initialState?.() ?? undefined
        )
      : null
  )

  // user-callable actions
  // function removePiece(coord: Coord) {
  //   level.value?.board.pieces.delete(coord)
  // }

  // function setPiece(coord: Coord, piece: Piece) {
  //   level.value?.board.pieces.set(coord, piece)
  // }

  function rotateCcw(coord: Coord) {
    const piece = level.value?.board.pieces.get(coord)
    if (piece != null && hasFlags(piece.flags, PieceFlags.Rotateable)) {
      level.value?.board.pieces.set(coord, {
        ...piece,
        rotation: nextElementRotation(piece.type, piece.rotation),
      })
    }
  }

  function actionImport(value: unknown): boolean {
    const imported = importLevel(value)
    if (imported == null) {
      return false
    } else {
      loadLevel(imported)
      return true
    }
  }

  function loadLevel(value: Level): void {
    level.value = value
  }

  function actionExport() {
    if (level.value == null) return null
    return exportLevel(level.value)
  }

  return proxyRefs({
    sim,
    level,
    // removePiece,
    // setPiece,
    rotateCcw,
    loadLevel,
    importLevel: actionImport,
    exportLevel: actionExport,
  })
}

export interface GameController {
  readonly sim: Simulation | null
  readonly level: Level | undefined

  // removePiece(coord: Coord): void
  // setPiece(coord: Coord, piece: Piece): void
  rotateCcw(coord: Coord): void

  loadLevel(value: Level): void
  /**
   * Load level from JSON representation.
   * returns `true` if level was successfuly loaded.
   * When loading fails, the previous level data is kept.
   */
  importLevel(value: unknown): boolean
  exportLevel(): Record<PropertyKey, unknown> | null
}
