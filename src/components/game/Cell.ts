// CELL CLASS
// Basic class for the grid cells
import Coord from './Coord';
import Element from './Element';
import Game from './Game';

export interface CellInterface {
	coord: { y: number; x: number };
	element: string;
	rotation: number;
	frozen: boolean;
	active?: boolean;
	energized?: boolean;
}

export default class Cell {
	coord: Coord;
	element: Element;
	rotation: number;
	frozen: boolean;
	active: boolean;
	energized: boolean;

	constructor(coord: Coord, element: Element, rotation = 0, frozen = false, active = false, energized = false) {
		this.coord = coord;
		this.element = element;
		this.rotation = rotation;
		this.frozen = frozen;
		this.active = active;
		this.energized = energized;
	}

	// Change frozen status of cell
	get ascii(): string {
		return this.element.ascii[this.rotation / this.element.rotationAngle];
	}
	get foregroundColor(): string {
		return this.element.foregroundColor;
	}
	get backgroundColor(): string {
		return this.element.backgroundColor;
	}
	get rotationAscii(): string {
		switch (this.element.rotationAngle) {
			case 0:
				return '^';
			case 90:
				return '>';
			case 180:
				return 'v';
			case 270:
				return '<';
			default:
				throw new Error('Wrong angle given...');
		}
	}

	// Rotate cell - Correcting the javascript modulo bug for negative values: https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
	rotate(angle: number = this.element.rotationAngle): void {
		if (!this.frozen) {
			if (Math.abs(angle) % this.element.rotationAngle !== 0) {
				throw new Error('Error in the supplied angle compared to the element rotation angle.');
			} else {
				this.rotation = (((this.rotation + angle) % 360) + 360) % 360;
			}
		} else {
			console.log('This cell is frozen, you can\'t rotate it.');
		}
	}

	toggleFreeze(): void {
		this.frozen = !this.frozen;
	}
	toggleActive(): void {
		this.active = !this.active;
	}
	toggleEnergized(): void {
		this.energized = !this.energized;
	}

	// DISPLAY METHODS
	draw(game: Game): void {
		game.draw(this);
	}

	// Override toString() method
	toString(): string {
		return `Cell @ ${this.coord.toString()} is ${this.frozen ? 'frozen' : 'unfrozen'} ${
			this.active ? 'active' : 'inactive'
		} and ${this.energized ? 'powered' : 'unpowered'} ${this.element.toString()} rotated ${this.rotation}°`;
	}

	// Export to JSON format
	exportCellJSON(): CellInterface {
		return {
			coord: this.coord,
			element: this.element.name,
			rotation: this.rotation,
			frozen: this.frozen,
			active: this.active,
			energized: this.energized
		};
	}

	// Import from JSON
	static importJSON(json: CellInterface): Cell {
		const coord = Coord.importJSON(json.coord);
		const element = Element.fromName(json.element);
		return new Cell(coord, element, json.rotation, json.frozen, json.active, json.energized);
	}
}