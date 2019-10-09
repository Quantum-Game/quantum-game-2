// COORDINATES CLASS
// Low level coordinate functions
// Coord is a [x, y, z?] convenient way to deal with coordinates.

export interface CoordInterface {
	x: number;
	y: number;
}

export default class Coord {
  x: number;

	y: number;

	constructor(y: number, x: number) {
		this.y = y;
		this.x = x;
	}

	// Conversion: coord -> uid
	id(rows: number): number {
		return this.y * rows + this.x;
	}

	// SVG coordinate system: top-left point of cell
	pos(spacing: number): [number, number] {
		const y = this.y * spacing;
		const x = this.x * spacing;
		return [y, x];
	}

	// Distance to exiting grid
	// Array offset corrected
	distanceToExit(direction = 0, rows: number, cols: number): number {
		switch (direction % 360) {
			case 0: // TOP
				return this.y;
			case 90: // RIGHT
				return cols - this.x - 1;
			case 180: // BOTTOM
				return rows - this.y - 1;
			case 270: // LEFT
				return this.x;
			default:
				throw new Error('Something went wrong with directions...');
		}
	}

	// Adjacent cells
	get top(): Coord {
		return Coord.importJSON({ y: this.y - 1, x: this.x });
	}
	get bottom(): Coord {
		return Coord.importJSON({ y: this.y + 1, x: this.x });
	}
	get left(): Coord {
		return Coord.importJSON({ y: this.y, x: this.x - 1 });
	}
	get right(): Coord {
		return Coord.importJSON({ y: this.y, x: this.x + 1 });
	}
	get adjacent(): Coord[] {
		return [this.top, this.right, this.bottom, this.left];
	}
	get array(): number[] {
		return [this.y, this.x];
	}

	// Check if two coordinates are adjacent
	isAdjacent(coord: Coord): boolean {
		return coord.isIncludedIn(this.adjacent);
	}

	// Check for equality
	equal(coord: Coord): boolean {
		return this.x === coord.x && this.y === coord.y;
	}

	// Test inclusion in array of coords
	isIncludedIn(coords: Coord[]): boolean {
		return (
			coords.filter(coord => {
				return this.equal(coord);
			}).length > 0
		);
	}

	// override of toString method for debugging
	toString(): string {
		return `[Y:${this.y}, X:${this.x}]`;
	}

	// Export JSON
	exportJSON(): CoordInterface {
		return {
			y: this.y,
			x: this.x
		};
	}

	// Export JSON
	static importJSON(json: CoordInterface): Coord {
		return new Coord(json.y, json.x);
	}

	// Conversion: uid -> coord
	static fromId(index: number, cols: number): Coord {
		const x = index % cols;
		const y = Math.floor(index / cols);
		return Coord.importJSON({ y: y, x: x });
	}
}