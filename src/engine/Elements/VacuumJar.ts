import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * VACUUM JAR CLASS
 */
export default class VacuumJar extends Element {
  public name: Elem = Elem.VacuumJar
  public group: Group = Group.Phase
  public description =
    'Even air retards light a bit. We set the thickness of vacuum so it advances the phase by λ/4. Useful for changing interference.'

  public ascii: string[] = ['↝']

  public allowedRotations: number[] = [0]
  public allowedPolarizations: number[] = []
  public allowedPercentages: number[] = [0, 0.25, 0.5, 0.75]

  public constructor(percentage = 0.25) {
    super(Elem.VacuumJar, Group.Phase)
    this.percentage = percentage
  }

  /* eslint-disable-next-line */
  public transition(options: ITransition): qt.Operator {
    return qt.Elements.vacuumJar()
    // return qt.Elements.vacuumJar(options.percentage)
  }
}
