import { computed, proxyRefs, ref } from 'vue'
import {
  importLevel,
  exportLevel,
  Level,
  runSimulation,
  Simulation,
  Coord,
  Vector,
} from '@/engine/model'
import { GoalsController, goalsController } from './goals'
import { grabController, GrabController } from './grab'
import { nextElementRotation } from '@/engine/elements'

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

  const goals = goalsController({
    absorptions: () => sim.value?.absorptions ?? null,
    level: () => level.value ?? null,
  })

  // user-callable actions
  // function removePiece(coord: Coord) {
  //   level.value?.board.pieces.delete(coord)
  // }

  // function setPiece(coord: Coord, piece: Piece) {
  //   level.value?.board.pieces.set(coord, piece)
  // }

  function rotateCcw(coord: Coord) {
    const piece = level.value?.board.pieces.get(coord)
    if (piece != null && piece.rotateable) {
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
    grab.putBack()
    level.value = value
  }

  function actionExport() {
    if (level.value == null) return null
    return exportLevel(level.value)
  }

  const grab = grabController({
    pieces: () => level.value?.board.pieces ?? null,
    toolbox: () => level.value?.toolbox ?? null,
  })

  return proxyRefs({
    sim,
    level,
    goals,
    grab,
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
  goals: GoalsController
  grab: GrabController

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
