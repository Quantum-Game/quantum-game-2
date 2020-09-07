import { Elem, Group } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * QUARTER WAVE PLATE CLASS
 */
export default class HalfWavePlate extends Element {
  public name: Elem = Elem.HalfWavePlate
  public group: Group = Group.Polarization
  public description = 'It delays one polarization (with darker lines) by λ/2.'

  public ascii: string[] = ['▤', '▨', '▥', '▧', '▤', '▨', '▥', '▧']
  public angles: number[] = [0, 45, 90, 135, 180, 225, 270, 315]

  public constructor() {
    super(Elem.HalfWavePlate, Group.Polarization)
  }
}
