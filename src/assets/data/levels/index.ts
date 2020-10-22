import introLevels from './introLevels.json'
import reflectionLevels from './reflectionLevels.json'
import phaseLevels from './phaseLevels.json'
import interferenceLevels from './interferenceLevels.json'
import polarizationLevels from './polarizationLevels.json'
import finalLevels from './finalLevels.json'
import classicLevels from './classicLevels.json'
import sandboxLevel from './sandboxLevel.json'
import benchmarkLevels from './benchmark.json'
import { $flags } from '@/flags'

export {
  sandboxLevel,
  introLevels,
  reflectionLevels,
  phaseLevels,
  interferenceLevels,
  polarizationLevels,
  finalLevels,
  classicLevels,
  benchmarkLevels,
}

const introGroup = introLevels
const reflectionGroup = reflectionLevels
const phaseGroup = phaseLevels
const interferenceGroup = interferenceLevels
const polarizationGroup = polarizationLevels
const finalGroup = finalLevels
const classicGroup = classicLevels
const benchmarkGroup = benchmarkLevels

export const levels = $flags.fullAccess
  ? [
      ...classicGroup,
      ...introGroup,
      ...reflectionGroup,
      ...phaseGroup,
      ...interferenceGroup,
      ...polarizationGroup,
      ...finalGroup,
      ...benchmarkGroup,
    ]
  : []

export enum LevelKind {
  Lab,
  Campaign,
  User,
}

export type LevelId =
  | { kind: LevelKind.Lab }
  | { kind: LevelKind.Campaign; index: number }
  | { kind: LevelKind.User; hash: string }

export function levelIdFromString(id: string): LevelId {
  if (id.match(/^\d{1,4}$/)) {
    return { kind: LevelKind.Campaign, index: +id }
  }
  return { kind: LevelKind.User, hash: id }
}

export function campaignLevel(index: number): unknown | null {
  return levels[index - 1] ?? null
}

export function campaignLink(levelId: LevelId | null, offset = 0): string | null {
  if (levelId?.kind === LevelKind.Campaign) {
    const newId = levelId.index + offset
    if (campaignLevel(newId) != null) {
      return `/level/${newId}`
    }
  }
  return null
}
