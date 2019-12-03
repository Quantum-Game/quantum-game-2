import { ILevel } from '@/engine/interfaces'
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

const introGroup: ILevel[] = introLevels
const reflectionGroup: ILevel[] = reflectionLevels
const phaseGroup: ILevel[] = phaseLevels
const interferenceGroup: ILevel[] = interferenceLevels
const polarizationGroup: ILevel[] = polarizationLevels
const finalGroup: ILevel[] = finalLevels
const classicGroup: ILevel[] = classicLevels

const levels: ILevel[] = [
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
