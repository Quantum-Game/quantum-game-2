import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * GLASS CLASS
 */
export default class Glass extends Element {
  public name: Elem = Elem.Glass
  public group: Group = Group.Phase
  public description =
    'Higher refractive index makes light slower. We set its thickness so it retards the phase by λ/4. Useful for changing interference.'

  public ascii: string[] = ['↜']

  public allowedRotations: number[] = [0]
  public allowedPolarizations: number[] = []
  public allowedPercentages: number[] = [0, 0.25, 0.5, 0.75, 1]

  public constructor(percentage = 0.25) {
    super(Elem.Glass, Group.Phase)
    this.percentage = percentage
  }

  /* eslint-disable-next-line */
  public transition(options: ITransition): qt.Operator {
    return qt.Elements.glassSlab()
  }
}
