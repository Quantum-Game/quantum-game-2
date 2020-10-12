import {
  Coord,
  Elem,
  hasFlags,
  Piece,
  PieceFlags,
  pieceFromTool,
  ReleasePoint,
} from '@/engine/model'
import Toolbox from '@/engine/Toolbox'
import { assertUnreachable } from '@/types'
import { proxyRefs, ref } from 'vue'

export const enum GrabSource {
  Toolbox,
  Board,
}

export interface ReleaseEvent {
  coord: Coord
  releasePoint: ReleasePoint
}

export type GrabState =
  | { source: GrabSource.Toolbox; type: Elem }
  | {
      source: GrabSource.Board
      coord: Coord
      piece: Piece & { releasePoint: null }
    }

export function grabController(data: {
  pieces: () => Map<Coord, Piece> | null
  toolbox: () => Toolbox | null
}): GrabController {
  const grabState = ref<GrabState | null>(null)

  /**
   * Grab a piece from the board at given coordinates.
   *
   * Will only do anything only if there is a draggable piece at target coordinages.
   * @param coord coordinates of the piece to grab
   */
  function grabPiece(coord: Coord) {
    putBack()
    const pieces = data.pieces()
    const piece = pieces?.get(coord)
    if (pieces == null || piece == null || !hasFlags(piece.flags, PieceFlags.Draggable)) return
    grabState.value = {
      source: GrabSource.Board,
      coord,
      piece: { ...piece, releasePoint: null },
    }
    pieces.delete(coord)
  }

  /**
   * Grab a tool of given type from toolbox.
   *
   * Will do anything only if there is a piece of given type left in the toolbox.
   * @param type type of the tool to grab
   */
  function grabTool(type: Elem) {
    putBack()
    const toolbox = data.toolbox()
    if (toolbox == null || !toolbox.removeTool(type)) return
    grabState.value = { source: GrabSource.Toolbox, type }
  }

  function releaseTool() {
    if (
      grabState.value?.source === GrabSource.Board &&
      hasFlags(grabState.value.piece.flags, PieceFlags.Rotateable | PieceFlags.Draggable)
    ) {
      data.toolbox()?.addTool(grabState.value.piece.type)
      grabState.value = null
    } else {
      putBack()
    }
  }

  function releasePiece({ coord, releasePoint }: ReleaseEvent) {
    const pieces = data.pieces()
    if (grabState.value != null && pieces != null) {
      const atBoard = pieces.get(coord)

      switch (grabState.value.source) {
        case GrabSource.Board:
          if (atBoard == null) {
            pieces.set(coord, { ...grabState.value.piece, releasePoint })
          } else if (hasFlags(atBoard.flags, PieceFlags.Rotateable)) {
            // swap two pieces together
            pieces.set(grabState.value.coord, atBoard)
            pieces.set(coord, { ...grabState.value.piece, releasePoint })
          } else {
            putBack()
          }
          break
        case GrabSource.Toolbox:
          if (atBoard == null) {
            pieces.set(coord, pieceFromTool(grabState.value.type, releasePoint))
          } else if (hasFlags(atBoard.flags, PieceFlags.Rotateable | PieceFlags.Draggable)) {
            // swap toolbox and board
            data.toolbox()?.addTool(atBoard.type)
            pieces.set(coord, pieceFromTool(grabState.value.type, releasePoint))
          } else {
            putBack()
          }
          break
        default:
          assertUnreachable(grabState.value)
      }
      grabState.value = null
    } else {
      putBack()
    }
  }

  function putBack() {
    const grab = grabState.value
    grabState.value = null
    if (grab == null) return

    switch (grab.source) {
      case GrabSource.Toolbox:
        data.toolbox()?.addTool(grab.type)
        break
      case GrabSource.Board:
        {
          const pieces = data.pieces()
          if (pieces != null && !pieces.has(grab.coord)) {
            pieces.set(grab.coord, grab.piece)
          } else {
            // This isn't exactly ideal with current toolbox setup,
            // as piece flags state will get lost
            if (!hasFlags(grab.piece.flags, PieceFlags.Rotateable)) {
              console.warn('Putting non-rotateable element to toolbox')
            }
            data.toolbox()?.addTool(grab.piece.type)
          }
        }
        break
      default:
        assertUnreachable(grab)
    }
  }

  return proxyRefs({
    grabState,
    grabPiece,
    grabTool,
    releaseTool,
    releasePiece,
    putBack,
  })
}

export interface GrabController {
  readonly grabState: GrabState | null
  grabPiece(coord: Coord): void
  grabTool(type: Elem): void
  releaseTool(): void
  releasePiece(event: ReleaseEvent): void
  putBack(): void
}
