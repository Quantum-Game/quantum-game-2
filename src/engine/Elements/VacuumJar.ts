import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * VACUUM JAR CLASS
 */
export default class VacuumJar extends Element {
  name: Elem = Elem.VacuumJar
  group: Group = Group.Phase
  description: string =
    'Even air retards light a bit. We set the thickness of vacuum so it advances the phase by λ/4. Useful for changing interference.'
  ascii: string[] = ['↝']
  angles: number[] = [0]

  percentage: number = 0.25

  constructor(percentage: number = 0.25) {
    super(Elem.VacuumJar, Group.Phase)
    this.percentage = percentage
  }

  transition(options: TransitionInterface): qt.Operator {
    return qt.vacuumJar()
  }
}
