import {
  isDef,
  isObject,
  tryGetBool,
  tryGetInstance,
  tryGetNumber,
  tryGetObject,
  tryGetProp,
  tryGetString,
} from '@/types'
import Toolbox from '../Toolbox'
import { Coord } from './coord'
import { Elem, exportElem, importElem } from './elem'
import { Rotation, rotationFromDegrees, rotationToDegrees } from './rotation'

export interface Level {
  readonly id: number
  //   description: string
  /** Level name */
  readonly name: string
  /** Board width */
  readonly board: Board
  /**
   * Pieces that can be dragged out onto a board.
   * All toolbox pieces must be draggable.
   */
  readonly toolbox: Toolbox
  readonly safetyThreshold: number
  readonly rockTalkId: string | null
}

export interface Board {
  readonly width: number
  readonly height: number
  readonly pieces: Map<Coord, Piece>
  readonly hints: Map<Coord, Hint>
}

/**
 * Exact board coordinates at last interaction, if any.
 * The coordinates are non-floored version of coord.
 */
export type ReleasePoint = null | {
  x: number
  y: number
}

export interface Piece {
  readonly type: Elem
  readonly rotation: Rotation
  readonly polarization: Rotation
  readonly goalThreshold: number
  readonly draggable: boolean
  readonly rotateable: boolean
  readonly releasePoint: ReleasePoint
}

export interface Hint {
  readonly content: string
  readonly color: string
}

/**
 * Import grid Piece from unknown value
 * @param value parsed JSON object
 */
function importPiece(
  value: unknown,
  importedGoals: Map<Coord, number>
): { coord: Coord; piece: Piece } | null {
  if (!isObject(value)) {
    return null
  }
  const type = importElem(tryGetProp(value, 'element'))
  const coord = Coord.import(tryGetProp(value, 'coord'))
  if (type == null || coord == null) return null

  const frozen = tryGetBool(value, 'frozen') ?? false
  const active = tryGetBool(value, 'active') ?? false

  const piece = {
    type,
    rotation: rotationFromDegrees(tryGetNumber(value, 'rotation') ?? 0),
    polarization: rotationFromDegrees(tryGetNumber(value, 'polarization') ?? 0),
    goalThreshold: importedGoals.get(coord) ?? 0,
    draggable: !frozen && active,
    rotateable: !frozen,
    releasePoint: null,
  }

  return { coord, piece }
}

/**
 * Import toolbox piece from unknown value
 * @param value parsed JSON object
 */
export function pieceFromTool(type: Elem, releasePoint: ReleasePoint): Piece & { draggable: true } {
  return {
    type,
    rotation: Rotation.Right,
    polarization: Rotation.Right,
    goalThreshold: type === Elem.Detector || type === Elem.DetectorFour ? 1 : 0,
    draggable: true,
    rotateable: true,
    releasePoint,
  }
}

/**
 * Import Hint from unknown value
 * @param value parsed JSON object
 */
function importHint(value: unknown): { coord: Coord; hint: Hint } | null {
  if (!isObject(value)) return null
  const content = tryGetString(value, 'content')
  const color = tryGetString(value, 'color')
  const coord = Coord.import(tryGetObject(value, 'coord'))
  if (coord == null || color == null || content == null) return null
  return {
    coord,
    hint: {
      content,
      color,
    },
  }
}

/**
 * Import Level from unknown value
 * @param value parsed JSON object
 */
export function importLevel(value: unknown): Level | null {
  if (!isObject(value)) return null

  const id = tryGetNumber(value, 'id') ?? 0
  const name = tryGetString(value, 'name') ?? 'Unnamed'
  const grid = tryGetObject(value, 'grid')
  const goals = tryGetInstance(value, 'goals', Array) ?? []
  const tools = tryGetInstance(value, 'tools', Array) ?? []

  if (grid == null) return null

  const width = tryGetNumber(grid, 'cols')
  const height = tryGetNumber(grid, 'rows')
  const cells = tryGetInstance(grid, 'cells', Array) ?? []
  const rawHints = tryGetInstance(grid, 'hints', Array) ?? []

  if (width == null || height == null) {
    console.error('grid width or height missing')
    return null
  }

  const goalsMap = new Map<Coord, number>()
  const pieces = new Map<Coord, Piece>()
  const hints = new Map<Coord, Hint>()

  for (const hint of rawHints) {
    const imported = importHint(hint)
    if (imported == null) {
      console.warn(`Invalid hint: '${JSON.stringify(hint)}'`)
      continue
    }
    hints.set(imported.coord, imported.hint)
  }

  for (const goal of goals) {
    if (!isObject(goal)) {
      console.warn(`Invalid goal: '${goal}'`)
      continue
    }

    const coord = Coord.import(tryGetObject(goal, 'coord'))
    const threshold = tryGetNumber(goal, 'threshold') ?? 1
    if (coord != null) {
      goalsMap.set(coord, threshold)
    }
  }

  for (const cell of cells) {
    const imported = importPiece(cell, goalsMap)
    if (imported == null) {
      console.warn(`Invalid cell: '${JSON.stringify(cell)}'`)
      continue
    }
    pieces.set(imported.coord, imported.piece)
  }

  return {
    id,
    name,
    board: {
      width,
      height,
      pieces,
      hints,
    },
    toolbox: Toolbox.import(tools),
    safetyThreshold: tryGetNumber(value, 'safetyThreshold') ?? 0,
    rockTalkId: tryGetString(value, 'rockTalkId'),
  }
}

export function exportLevel(level: Level): Record<PropertyKey, unknown> {
  return {
    id: level.id,
    name: level.name,
    grid: {
      cols: level.board.width,
      rows: level.board.height,
      cells: Array.from(level.board.pieces).map(([coord, piece]) => ({
        coord: coord.export(),
        element: exportElem(piece.type),
        rotation: rotationToDegrees(piece.rotation),
        polarization: rotationToDegrees(piece.polarization),
        frozen: !piece.rotateable,
        active: piece.rotateable,
      })),
    },
    hints: Array.from(level.board.hints).map(([coord, hint]) => ({
      coord: coord.export(),
      content: hint.content,
      color: hint.color,
    })),
    goals: Array.from(level.board.pieces)
      .map(([coord, piece]) => {
        if (piece.goalThreshold > 0) {
          return {
            coord: coord.export(),
            threshold: piece.goalThreshold,
          }
        }
      })
      .filter(isDef),
    tools: level.toolbox.export(),
  }
}
