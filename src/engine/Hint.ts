import { IHint } from './interfaces'
import Coord from './Coord'

/**
 * HINT CLASS
 * Hint will be active when simulation or gameplay events fire.
 */
export default class Hint extends Coord {
  public coord: Coord
  public message: string
  public type?: string
  public rotation?: number
  public active?: boolean

  public constructor(coord: Coord, message: string, type = 'purple', rotation = 0, active = true) {
    super(coord.y, coord.x)
    this.coord = coord
    this.message = message
    this.type = type
    this.rotation = rotation
    this.active = active
  }

  /**
   * Override toString() method
   * @returns hint string
   */
  public toString(): string {
    return `{#HINT ${this.message} @ ${this.coord.toString()}}`
  }

  /**
   * Export hint in primitives
   * @returns hint interface
   */
  public exportHint(): IHint {
    return {
      coord: this.coord.exportCoord(),
      message: this.message,
      type: this.type,
      rotation: this.rotation,
      active: this.active
    }
  }

  /**
   * Process a list of hint interfaces
   * @param jsonHints list of hints
   * @returns Hint instances
   */
  public static importHint(iHints: IHint[]): Hint[] {
    return iHints.map(
      (iHint): Hint => {
        const coord = Coord.importCoord(iHint.coord)
        return new Hint(coord, iHint.message, iHint.type, iHint.rotation, iHint.active)
      }
    )
  }
}
