import introLevels from './introLevels.json'
import reflectionLevels from './reflectionLevels.json'
import phaseLevels from './phaseLevels.json'
import interferenceLevels from './interferenceLevels.json'
import polarizationLevels from './polarizationLevels.json'
import finalLevels from './finalLevels.json'
import classicLevels from './classicLevels.json'
import sandbox from './sandboxLevel.json'
import benchmarkLevels from './benchmark.json'

export {
  sandbox,
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

const levels = [
  sandbox,
  ...classicGroup,
  ...introGroup,
  ...reflectionGroup,
  ...phaseGroup,
  ...interferenceGroup,
  ...polarizationGroup,
  ...finalGroup,
  ...benchmarkGroup,
]

export default levels
