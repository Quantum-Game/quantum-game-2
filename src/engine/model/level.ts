import {
  assertUnreachable,
  isDef,
  isObject,
  tryGetBool,
  tryGetInstance,
  tryGetNumber,
  tryGetObject,
  tryGetProp,
  tryGetString,
} from '@/types'
import { elementAngles } from '../elements'
import Toolbox from '../Toolbox'
import { Coord } from './coord'
import { defaultPiece, Elem, exportElem, importElem, Piece, PieceFlags } from './elem'
import { rotationFromDegrees, rotationToDegrees } from './rotation'

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
  readonly hints: Hint[]
}

export interface Vec2 {
  readonly x: number
  readonly y: number
}

export enum HintType {
  Speech,
  ActionHighlight,
}

export interface SpeechHint {
  readonly type: HintType.Speech
  readonly coord: Coord
  readonly content: string
  readonly color: string
}

export interface PartialActionHighlight {
  readonly type: HintType.ActionHighlight
  readonly coord: Coord
  readonly action: HintActionType | null
  readonly order: number
}

export const enum HintActionType {
  Rotation,
  Drag,
  Pulse,
}

function importActionType(value: unknown): HintActionType | null {
  if (value === 'rotation') return HintActionType.Rotation
  if (value === 'drag') return HintActionType.Drag
  if (value === 'pulse') return HintActionType.Pulse
  return null
}

export type Hint = SpeechHint | PartialActionHighlight
/**
 * Import grid Piece from unknown value
 * @param value parsed JSON object
 */
export function importPiece(
  value: unknown,
  importedGoals?: Map<Coord, number>
): { coord: Coord; piece: Piece } | null {
  if (!isObject(value)) {
    return null
  }
  const type = importElem(tryGetProp(value, 'element'))
  const coord = Coord.import(tryGetProp(value, 'coord'))
  if (type == null || coord == null) return null

  const frozen = tryGetBool(value, 'frozen') ?? true
  const active = tryGetBool(value, 'active') ?? false
  const draggable = tryGetBool(value, 'draggable') ?? (!frozen && active)
  const rotateable = tryGetBool(value, 'rotateable') ?? !frozen
  const goalThreshold = importedGoals?.get(coord) ?? tryGetNumber(value, 'goalThreshold') ?? 0
  const rotation = rotationFromDegrees(tryGetNumber(value, 'rotation') ?? 0)

  let flags = PieceFlags.Empty
  if (draggable) flags |= PieceFlags.Draggable
  if (rotateable) flags |= PieceFlags.Rotateable

  const common = { flags, interactDelta: null }

  const piece = ((): Piece => {
    switch (type) {
      case Elem.Wall:
      case Elem.Rock:
      case Elem.Gate:
      case Elem.Mine:
      case Elem.Glass:
      case Elem.VacuumJar:
      case Elem.CornerCube:
      case Elem.NonLinearCrystal:
        return { ...common, type }
      case Elem.Laser:
        return {
          ...common,
          type,
          rotation,
          polarization: tryGetNumber(value, 'polarization') ?? 0,
        }
      case Elem.Mirror:
        return { ...common, type, rotation }
      case Elem.BeamSplitter:
      case Elem.CoatedBeamSplitter:
        return { ...common, type, rotation, split: tryGetNumber(value, 'split') ?? 0.5 }
      case Elem.PolarizingBeamSplitter:
        return { ...common, type, rotation }
      case Elem.Detector:
        return { ...common, type, rotation, goalThreshold }
      case Elem.DetectorFour:
        return { ...common, type, goalThreshold }
      case Elem.Absorber:
        return { ...common, type, absorption: tryGetNumber(value, 'absorption') ?? 0.5 }
      case Elem.Polarizer:
        return { ...common, type, rotation }
      case Elem.QuarterWavePlate:
        return { ...common, type, rotation }
      case Elem.HalfWavePlate:
        return { ...common, type, rotation }
      case Elem.SugarSolution:
        return {
          ...common,
          type,
          polarizationRotation: tryGetNumber(value, 'polarization') ?? 0.125,
        }
      case Elem.FaradayRotator:
        return {
          ...common,
          type,
          rotation,
          polarizationRotation: tryGetNumber(value, 'polarization') ?? 0.125,
        }
      default:
        assertUnreachable(type)
    }
  })()

  return { coord, piece }
}

export function hasFlags(flags: PieceFlags, mask: PieceFlags): boolean {
  return (flags & mask) === mask
}

export function setFlags(flags: PieceFlags, mask: PieceFlags, set: boolean): PieceFlags {
  if (set) {
    return flags | mask
  } else {
    return flags & ~mask
  }
}

export function hasAnyFlag(flags: PieceFlags, mask: PieceFlags): boolean {
  return (flags & mask) !== 0
}

/**
 * Import toolbox piece from unknown value
 * @param value parsed JSON object
 */
export function pieceFromTool(type: Elem, interactDelta: Vec2 | null): Piece {
  return {
    ...defaultPiece(type),
    flags: PieceFlags.Rotateable | (elementAngles(type).length > 1 ? PieceFlags.Draggable : 0),
    interactDelta,
  }
}

/**
 * Import Hint from unknown value
 * @param value parsed JSON object
 */
function importHint(value: unknown): Hint | null {
  if (!isObject(value)) return null
  const coord = Coord.import(tryGetObject(value, 'coord'))
  if (coord == null) return null

  const order = tryGetNumber(value, 'order')
  if (order != null) {
    return {
      type: HintType.ActionHighlight,
      coord,
      order,
      action: importActionType(tryGetString(value, 'action')),
    }
  }

  const content = tryGetString(value, 'content')
  const color = tryGetString(value, 'color')
  if (color != null && content != null) {
    return {
      type: HintType.Speech,
      coord,
      content,
      color,
    }
  }
  return null
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
  const toolsInfinite = tryGetBool(value, 'toolsInfinite') ?? false
  const rawHints = tryGetInstance(value, 'hints', Array) ?? []

  if (grid == null) return null

  const width = tryGetNumber(grid, 'cols')
  const height = tryGetNumber(grid, 'rows')
  const cells = tryGetInstance(grid, 'cells', Array) ?? []

  if (width == null || height == null) {
    console.error('grid width or height missing')
    return null
  }

  const goalsMap = new Map<Coord, number>()
  const pieces = new Map<Coord, Piece>()
  const hints = [] as Hint[]

  for (const hint of rawHints) {
    const imported = importHint(hint)
    if (imported == null) {
      console.warn(`Invalid hint: '${JSON.stringify(hint)}'`)
      continue
    }
    hints.push(imported)
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
    toolbox: Toolbox.import(tools, toolsInfinite),
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
        rotation: 'rotation' in piece ? rotationToDegrees(piece.rotation) : undefined,
        goalThreshold:
          'goalThreshold' in piece ? rotationToDegrees(piece.goalThreshold) : undefined,
        rotateable: hasFlags(piece.flags, PieceFlags.Rotateable),
        draggable: hasFlags(piece.flags, PieceFlags.Draggable),
      })),
    },
    hints: level.board.hints.map((hint) => {
      switch (hint.type) {
        case HintType.Speech:
          return {
            coord: hint.coord.export(),
            content: hint.content,
            color: hint.color,
          }
        case HintType.ActionHighlight:
          return {
            coord: hint.coord.export(),
            action: hint.order,
          }
      }
    }),
    goals: Array.from(level.board.pieces)
      .map(([coord, piece]) => {
        if ('goalThreshold' in piece && piece.goalThreshold > 0) {
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
