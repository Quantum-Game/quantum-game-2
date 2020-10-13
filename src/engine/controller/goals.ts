import { Elem, Level, Coord } from '@/engine/model'
import { iFilterMap } from '@/itertools'
import { computed, proxyRefs } from 'vue'

export const enum GameOutcome {
  LevelNotLoaded,
  Victory,
  MineExploded,
  GoalsNotCompleted,
}

export function goalsController(data: {
  absorptions: () => Map<Coord, number> | null
  level: () => Level | null
}): GoalsController {
  const mines = computed(() =>
    Array.from(
      iFilterMap(data.level()?.board.pieces ?? [], ([k, v]) => (v.type === Elem.Mine ? k : null))
    )
  )
  const allGoals = computed(() =>
    Array.from(
      iFilterMap(data.level()?.board.pieces ?? [], ([coord, piece]) =>
        piece.goalThreshold > 0 ? { coord, threshold: piece.goalThreshold } : null
      )
    )
  )

  const safetyThreshold = computed(() => data.level()?.safetyThreshold ?? 0)

  const allGoalsMet = computed(() => {
    const absorptions = data.absorptions()
    if (absorptions == null) return 0

    return allGoals.value.every(
      ({ coord, threshold }) => (absorptions.get(coord) ?? 0) >= threshold
    )
  })

  const allMinesSafe = computed(() => {
    const absorptions = data.absorptions()
    const threshold = safetyThreshold.value
    if (absorptions == null) return 0
    return mines.value.every((coord) => (absorptions.get(coord) ?? 0) <= threshold)
  })
  const gameOutcome = computed(() => {
    if (data.level() == null) {
      return GameOutcome.LevelNotLoaded
    }
    // Simulation will trigger mine
    if (!allMinesSafe.value) {
      return GameOutcome.MineExploded
    }
    // Goals are unmet
    if (!allGoalsMet.value) {
      return GameOutcome.GoalsNotCompleted
    }
    // All conditions met for victory
    return GameOutcome.Victory
  })

  return proxyRefs({
    gameOutcome,
  })
}

export interface GoalsController {
  readonly gameOutcome: GameOutcome
}
