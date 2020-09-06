import { IHint } from '@/engine/interfaces'
import Coord from './Coord'

/**
 * HINT CLASS
 * Hint will be active when simulation or gameplay events fire.
 */
export default class Hint extends Coord {
  public coord: Coord
  public content: string
  public color?: string
  public rotation?: number
  public active?: boolean

  public constructor(coord: Coord, content: string, color = 'purple', rotation = 0, active = true) {
    super(coord.y, coord.x)
    this.coord = coord
    this.content = content
    this.color = color
    this.rotation = rotation
    this.active = active
  }

  /**
   * Override toString() method
   * @returns hint string
   */
  public toString(): string {
    return `{#HINT ${this.content} @ ${this.coord.toString()}}`
  }

  /**
   * Export hint in primitives
   * @returns hint interface
   */
  public exportHint(): IHint {
    return {
      coord: this.coord.exportCoord(),
      content: this.content,
      color: this.color,
      rotation: this.rotation,
      active: this.active,
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
        return new Hint(coord, iHint.content, iHint.color, iHint.rotation, iHint.active)
      }
    )
  }
}
