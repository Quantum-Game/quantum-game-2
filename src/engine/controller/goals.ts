import { Elem, Level, Coord } from '@/engine/model'
import { iFilterMap } from '@/itertools'
import { computed, proxyRefs } from 'vue'

export const enum GameOutcome {
  LevelNotLoaded,
  Victory,
  MineExploded,
  GoalsNotCompleted,
  ProbabilityTooLow,
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

  const minesHit = computed(() => {
    const absorptions = data.absorptions()
    const threshold = safetyThreshold.value
    if (absorptions == null) return 0
    return mines.value.filter((coord) => (absorptions.get(coord) ?? 0) > threshold).length
  })

  const minesUnhit = computed(() => mines.value.length - minesHit.value)

  const goalsMet = computed(() => {
    const absorptions = data.absorptions()
    if (absorptions == null) return 0

    return allGoals.value.filter(({ coord }) => (absorptions.get(coord) ?? 0) > 0).length
  })

  const goalsUnmet = computed(() => allGoals.value.length - goalsMet.value)

  const totalAbsorption = computed(() => {
    const absorptions = data.absorptions()
    if (absorptions == null) return 0
    return allGoals.value.reduce((sum, { coord }) => sum + (absorptions.get(coord) ?? 0), 0)
  })

  const totalGoalThreshold = computed(() =>
    allGoals.value.reduce((sum, { threshold }) => sum + threshold, 0)
  )

  const allMinesSafe = computed(() => minesHit.value === 0)
  const allGoalsMet = computed(() => goalsUnmet.value === 0)
  const probabilityGoalMet = computed(() => totalAbsorption.value >= totalGoalThreshold.value)

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
    // Total probability is too low
    if (!probabilityGoalMet.value) {
      return GameOutcome.ProbabilityTooLow
    }
    // All conditions met for victory
    return GameOutcome.Victory
  })

  return proxyRefs({
    gameOutcome,
    totalAbsorption,
    safetyThreshold,
    allMinesSafe,
    allGoalsMet,
    probabilityGoalMet,
    totalGoalThreshold,
    goalsMet,
    goalsUnmet,
    minesHit,
    minesUnhit,
  })
}

export interface GoalsController {
  readonly gameOutcome: GameOutcome
  readonly totalAbsorption: number
  readonly safetyThreshold: number
  readonly allMinesSafe: boolean
  readonly allGoalsMet: boolean
  readonly probabilityGoalMet: boolean
  readonly totalGoalThreshold: number
  readonly goalsMet: number
  readonly goalsUnmet: number
  readonly minesHit: number
  readonly minesUnhit: number
}
