import {
  Board,
  Coord,
  Elem,
  hasFlags,
  HintActionType,
  HintType,
  Piece,
  PieceFlags,
  Rotation,
  SpeechHint,
} from '@/engine/model'
import { iFilterMap } from '@/itertools'
import { computed, proxyRefs, ref } from 'vue'

export interface ActionHighlight {
  readonly action: HintActionType
  readonly coord: Coord
  readonly order: number
  readonly elem: Elem
  readonly rotation: Rotation
}

function actionTypeForPiece(piece: Piece): HintActionType {
  if (hasFlags(piece.flags, PieceFlags.Draggable)) return HintActionType.Drag
  if (hasFlags(piece.flags, PieceFlags.Rotateable)) return HintActionType.Rotation
  return HintActionType.Pulse
}

export function hintsController(options: { board: () => Board | null }): HighlightsController {
  const lastActionOrder = ref(-1)

  const speechBubbles = computed(
    () =>
      options.board()?.hints.filter((hint): hint is SpeechHint => hint.type === HintType.Speech) ??
      []
  )

  const allActionHighlights = computed((): ActionHighlight[] => {
    const board = options.board()
    if (board == null) return []
    return Array.from(
      iFilterMap(board.hints, (h): ActionHighlight | null => {
        if (h.type !== HintType.ActionHighlight) return null
        const piece = board.pieces.get(h.coord)
        if (piece == null) return null
        return {
          action: h.action ?? actionTypeForPiece(piece),
          coord: h.coord,
          order: h.order,
          elem: piece.type,
          rotation: piece.rotation,
        }
      })
    )
  })

  const currentActionOrder = computed(() => {
    const lowerBound = lastActionOrder.value
    return Math.min(
      ...iFilterMap(allActionHighlights.value, (highlight) =>
        highlight.order > lowerBound ? highlight.order : null
      )
    )
  })

  const activeActionHighlights = computed(() => {
    const order = currentActionOrder.value
    return allActionHighlights.value.filter((hint) => hint.order === order)
  })

  function advanceHighlights(coord: Coord, actions: HintActionType[]) {
    const action = activeActionHighlights.value.find(
      (h) => h.coord === coord && actions.includes(h.action)
    )
    if (action != null) {
      lastActionOrder.value = currentActionOrder.value
    }
  }

  return proxyRefs({ speechBubbles, activeActionHighlights, advanceHighlights })
}

interface HighlightsController {
  readonly speechBubbles: SpeechHint[]
  readonly activeActionHighlights: ActionHighlight[]
  advanceHighlights(coord: Coord, actions: HintActionType[]): void
}
