import { LevelInterface } from '@/engine/interfaces'
import introLevels from './adventure/introLevels.json'
import reflectionLevels from './adventure/reflectionLevels.json'
import phaseLevels from './adventure/phaseLevels.json'
import interferenceLevels from './adventure/interferenceLevels.json'
import polarizationLevels from './adventure/polarizationLevels.json'
import finalLevels from './adventure/finalLevels.json'
import classicLevels from './classic/index'
import sandbox from './sandboxLevel.json'

export {
  sandbox,
  introLevels,
  reflectionLevels,
  phaseLevels,
  interferenceLevels,
  polarizationLevels,
  finalLevels,
  classicLevels
}

const introGroup: LevelInterface[] = introLevels
const reflectionGroup: LevelInterface[] = reflectionLevels
const phaseGroup: LevelInterface[] = phaseLevels
const interferenceGroup: LevelInterface[] = interferenceLevels
const polarizationGroup: LevelInterface[] = polarizationLevels
const finalGroup: LevelInterface[] = finalLevels
const classicGroup: LevelInterface[] = classicLevels

const levels: LevelInterface[] = [
  sandbox,
  ...classicGroup,
  ...introGroup,
  ...reflectionGroup,
  ...phaseGroup,
  ...interferenceGroup,
  ...polarizationGroup,
  ...finalGroup
]

export default levels
