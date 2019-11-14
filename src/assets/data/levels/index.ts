import { LevelInterface } from '@/engine/interfaces';
import introLevels from './adventure/introLevels.json';
import reflectionLevels from './adventure/reflectionLevels.json';
import phaseLevels from './adventure/phaseLevels.json';
import interferenceLevels from './adventure/interferenceLevels.json';
import polarizationLevels from './adventure/polarizationLevels.json';
import finalLevels from './adventure/finalLevels.json';
import sandbox from './sandboxLevel.json';
import classicLevels from './classic/index';

export {
  sandbox,
  introLevels,
  reflectionLevels,
  phaseLevels,
  interferenceLevels,
  polarizationLevels,
  finalLevels
};

const introGroup: LevelInterface[] = introLevels;
const reflectionGroup: LevelInterface[] = reflectionLevels;
const phaseGroup: LevelInterface[] = phaseLevels;
const interferenceGroup: LevelInterface[] = interferenceLevels;
const polarizationGroup: LevelInterface[] = polarizationLevels;
const finalGroup: LevelInterface[] = finalLevels;

const levels: LevelInterface[] = [
  sandbox,
  introGroup[0],
  introGroup[1],
  reflectionGroup[0],
  reflectionGroup[1],
  phaseGroup[0],
  phaseGroup[1],
  interferenceGroup[0],
  interferenceGroup[1],
  polarizationGroup[0],
  polarizationGroup[1],
  finalGroup[0],
  finalGroup[1]
].concat(classicLevels);
export default levels;
