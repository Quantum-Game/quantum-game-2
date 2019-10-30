import { CellInterface } from './interfaces';
import Coord from './Coord';
import Element from './Element';
import Particle from './Particle';
import { angleToSymbol } from './Helpers';
/**
 * CELL CLASS
 * A cell is a rotated element at a coordinate
 */
export default class Cell {
	coord: Coord;
	element: Element;
	rotation: number;
	frozen: boolean;
	active: boolean;
	energized: boolean;

	constructor(
		coord: Coord,
		element: Element,
		rotation = 0,
		frozen = false,
		active = false,
		energized = false
	) {
		this.coord = coord;
		this.element = element;
		this.rotation = rotation;
		this.frozen = frozen;
		this.active = active;
		this.energized = energized;
	}

	/**
	 * Get ASCII character linked to cell's element and cell rotation
	 * @returns ascii representation of rotated element
	 */
	get ascii(): string {
		return this.element.ascii[this.rotation / this.element.rotationAngle];
	}

	/**
	 * Is element blank?
	 * @returns true if blank
	 */
	get isVoid(): boolean {
		return this.element.name === 'Void';
	}

	/**
	 * Ouput the rotation with an unicode arrow
	 * @returns unicode arrow describing rotation
	 */
	get rotationAscii(): string {
		return angleToSymbol(this.element.rotationAngle);
	}

	/**
	 * Rotate cell
	 * Correcting the javascript modulo bug for negative values: https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
	 * @param angle rotation angle in degrees
	 */
	rotate(angle: number = this.element.rotationAngle): void {
		if (!this.frozen) {
			if (Math.abs(angle) % this.element.rotationAngle !== 0) {
				throw new Error('Error in the supplied angle compared to the element rotation angle.');
			} else {
				this.rotation = (((this.rotation + angle) % 360) + 360) % 360;
			}
		} else {
			console.error("This cell is frozen, you can't rotate it.");
		}
	}

	/**
	 * Toggle the frozen status of the cell
	 */
	toggleFreeze(): void {
		this.frozen = !this.frozen;
	}

	/**
	 * Toggle the active status of the cell, activate laser for example
	 */
	toggleActive(): void {
		this.active = !this.active;
	}

	/**
	 * Toggle the energized status of the cell, cells are energized around an activated detector
	 */
	toggleEnergized(): void {
		this.energized = !this.energized;
	}

	/**
	 * Fire the laser
	 * Convert the laser direction and position into a photon
	 * @returns Particle
	 */
	fire(): Particle {
		if (this.active) {
			return new Particle(this.coord, this.rotation, 1, 0);
		}
		throw Error('Laser is inactive...');
	}

	/**
	 * Output a string describing the cell, overrides toString() method
	 * @returns string describing the cell status
	 */
	toString(): string {
		return `Cell @ ${this.coord.toString()} is ${this.frozen ? 'frozen' : 'unfrozen'} ${
			this.active ? 'active' : 'inactive'
		} and ${this.energized ? 'powered' : 'unpowered'} ${this.element.toString()} rotated ${
			this.rotation
		}°`;
	}

	/**
	 * Export a cell interface
	 * @returns CellInterface
	 */
	exportCell(): CellInterface {
		return {
			coord: this.coord.exportCoord(),
			element: this.element.name,
			rotation: this.rotation,
			frozen: this.frozen,
			active: this.active,
			energized: this.energized
		};
	}

	/**
	 * Create a cell from a CellInterface
	 * @param obj CellInterface
	 */
	static importCell(obj: CellInterface): Cell {
		const coord = Coord.importCoord(obj.coord);
		const element = Element.fromName(obj.element);
		return new Cell(coord, element, obj.rotation, obj.frozen, obj.active, obj.energized);
	}
}
