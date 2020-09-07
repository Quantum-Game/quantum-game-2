import { Elem, Group } from '@/engine/interfaces'
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
  public angles: number[] = [0]

  public percentage = 0.25

  public constructor(percentage = 0.25) {
    super(Elem.VacuumJar, Group.Phase)
    this.percentage = percentage
  }
}
