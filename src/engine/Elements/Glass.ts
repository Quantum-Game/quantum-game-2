import { Elem, Group } from '@/engine/interfaces'
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
  public angles: number[] = [0]

  public percentage = 0.25

  public constructor(percentage = 0.25) {
    super(Elem.Glass, Group.Phase)
    this.percentage = percentage
  }
}
