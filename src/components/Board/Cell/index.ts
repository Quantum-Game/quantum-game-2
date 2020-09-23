import { Elem } from '@/engine/interfaces'

import AbsorberCell from './AbsorberCell.vue'
import BeamSplitterCell from './BeamSplitterCell.vue'
import MineCell from './MineCell.vue'
import CoatedBeamSplitterCell from './CoatedBeamSplitterCell.vue'
import CornerCubeCell from './CornerCubeCell.vue'
import DetectorCell from './DetectorCell.vue'
import LaserCell from './LaserCell.vue'
import GlassCell from './GlassCell.vue'
import MirrorCell from './MirrorCell.vue'
import DetectorFourCell from './DetectorFourCell.vue'
import PolarizerCell from './PolarizerCell.vue'
import PolarizingBeamSplitterCell from './PolarizingBeamSplitterCell.vue'
import RockCell from './RockCell.vue'
import SugarSolutionCell from './SugarSolutionCell.vue'
import VacuumJarCell from './VacuumJarCell.vue'
import QuarterWavePlateCell from './QuarterWavePlateCell.vue'
import HalfWavePlateCell from './HalfWavePlateCell.vue'
import FaradayRotatorCell from './FaradayRotatorCell.vue'
import NonLinearCrystalCell from './NonLinearCrystalCell.vue'

export {
  AbsorberCell,
  BeamSplitterCell,
  MineCell,
  CoatedBeamSplitterCell,
  CornerCubeCell,
  DetectorCell,
  LaserCell,
  GlassCell,
  MirrorCell,
  DetectorFourCell,
  PolarizerCell,
  PolarizingBeamSplitterCell,
  RockCell,
  SugarSolutionCell,
  VacuumJarCell,
  QuarterWavePlateCell,
  HalfWavePlateCell,
  FaradayRotatorCell,
  NonLinearCrystalCell,
}

export const elementComponents: Record<Elem, unknown> = {
  [Elem.Void]: undefined,
  [Elem.Wall]: undefined,
  [Elem.Gate]: undefined,
  [Elem.Laser]: LaserCell,
  [Elem.NonLinearCrystal]: NonLinearCrystalCell,
  [Elem.Mirror]: MirrorCell,
  [Elem.BeamSplitter]: BeamSplitterCell,
  [Elem.PolarizingBeamSplitter]: PolarizingBeamSplitterCell,
  [Elem.CoatedBeamSplitter]: CoatedBeamSplitterCell,
  [Elem.CornerCube]: CornerCubeCell,
  [Elem.Detector]: DetectorCell,
  [Elem.Rock]: RockCell,
  [Elem.Mine]: MineCell,
  [Elem.Absorber]: AbsorberCell,
  [Elem.DetectorFour]: DetectorFourCell,
  [Elem.Polarizer]: PolarizerCell,
  [Elem.QuarterWavePlate]: QuarterWavePlateCell,
  [Elem.HalfWavePlate]: HalfWavePlateCell,
  [Elem.SugarSolution]: SugarSolutionCell,
  [Elem.FaradayRotator]: FaradayRotatorCell,
  [Elem.Glass]: GlassCell,
  [Elem.VacuumJar]: VacuumJarCell,
}
