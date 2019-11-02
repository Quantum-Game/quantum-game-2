import { HintInterface } from './interfaces';
import Coord from './Coord';

/**
 * HINT CLASS
 * Hint will be active when simulation or gameplay events fire.
 */
export default class Hint {
  coord: Coord;
  content: string;
  color?: string;
  rotation?: number;
  active?: boolean;

  constructor(coord: Coord, content: string, color = 'purple', rotation = 0, active = true) {
    this.coord = coord;
    this.content = content;
    this.color = color;
    this.rotation = rotation;
    this.active = active;
  }

  /**
   * Override toString() method
   * @returns hint string
   */
  toString(): string {
    return `{#HINT ${this.content} @ ${this.coord.toString()}}`;
  }

  /**
   * Export hint in primitives
   * @returns hint interface
   */
  exportHint(): HintInterface {
    return {
      coord: this.coord.exportCoord(),
      content: this.content,
      color: this.color,
      rotation: this.rotation,
      active: this.active
    };
  }

  /**
   * Process a list of hint interfaces
   * @param jsonHints list of hints
   * @returns Hint instances
   */
  static importHint(jsonHints: HintInterface[]): Hint[] {
    return jsonHints.map((hint) => {
      const coord = Coord.importCoord(hint.coord);
      return new Hint(coord, hint.content, hint.color, hint.rotation, hint.active);
    });
  }
}
