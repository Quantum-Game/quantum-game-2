import { HintInterface } from './interfaces';
import Coord from './Coord';

/**
 * HINT CLASS
 * Hint will be active when simulation or gameplay events fire.
 */
export default class Hint {
  coord: Coord;
  width: number;
  text: string;
  direction: string;
  active: boolean;

  constructor(coord: Coord, text: string, width = 5, direction = 'left', active = true) {
    this.coord = coord;
    this.width = width;
    this.text = text;
    this.direction = direction;
    this.active = active;
  }

  /**
   * Override toString() method
   * @returns hint string
   */
  toString(): string {
    return `{#HINT ${this.text} @ ${this.coord.toString()}}`;
  }

  /**
   * Export hint in primitives
   * @returns hint interface
   */
  exportHint(): HintInterface {
    return {
      coord: this.coord.exportCoord(),
      text: this.text
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
      return new Hint(coord, hint.text);
    });
  }
}
