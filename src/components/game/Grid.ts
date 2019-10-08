// GRID CLASS
// FIXME: Figure a way to have uid and coord access to cells
// FIXME: Figure out blank cells in constructor
import Cell, { CellInterface } from "./Cell";
import Cluster from "./Cluster";
import Coord from "./Coord";
import Element from "./Element";
import Pointer, { PathPointer } from "./Pointer";

export default class Grid {
	public cols: number;
	public rows: number;
	public matrix: Cell[][];
	public clusters: Cluster[];

	constructor(rows: number, cols: number, matrix?: Cell[][]) {
		this.rows = rows;
		this.cols = cols;
		this.clusters = [];

		// If matrix specified extract cells
		if (matrix) {
			this.matrix = matrix;
		} else {
			// Else create blank cells
			this.matrix = new Array(this.rows).fill(0).map(() => new Array(this.cols).fill(0));
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const coord = Coord.importJSON({ y: y, x: x });
					this.set(new Cell(coord, Element.fromName("void")));
				}
			}
		}
	}
	// Get center coordinates of grid
	get center(): Coord {
		return Coord.importJSON({
			y: Math.floor(this.cols / 2),
			x: Math.floor(this.rows / 2)
		});
	}

	// Cells getters
	get cells(): Cell[] {
		return this.matrix.reduce((acc, val) => acc.concat(val), []);
	}
	get coords(): Coord[] {
		return this.cells.flatMap(cell => cell.coord);
	}
	get void(): Cell[] {
		return this.filteredBy("void");
	}
	get unvoid(): Cell[] {
		return this.filteredByNot("void");
	}
	get activeCells(): Cell[] {
		return this.cells.filter(cell => cell.active);
	}
	get energizedDetectors(): Cell[] {
		return this.detectors.filter(detector => detector.energized);
	}
	get unenergizedDetectors(): Cell[] {
		return this.detectors.filter(detector => !detector.energized);
	}

	// Emitters
	get lasers(): Cell[] {
		return this.filteredBy("laser");
	}
	get activeLasers(): Cell[] {
		return this.filteredBy("laser").filter(laser => laser.active === true);
	}

	// Reflectors
	get mirrors(): Cell[] {
		return this.filteredBy("mirror");
	}
	get beamsplitters(): Cell[] {
		return this.filteredBy("beamsplitter");
	}
	get coatedsplitters(): Cell[] {
		return this.filteredBy("coatedsplitter");
	}
	get polarsplitters(): Cell[] {
		return this.filteredBy("polarsplitter");
	}
	get reflectors(): Cell[] {
		return this.mirrors.concat(this.beamsplitters, this.coatedsplitters, this.polarsplitters);
	}

	// Absorbers
	get detectors(): Cell[] {
		return this.filteredBy("detector");
	}
	get mines(): Cell[] {
		return this.filteredBy("mine");
	}
	get rocks(): Cell[] {
		return this.filteredBy("rock");
	}
	get omnidetectors(): Cell[] {
		return this.filteredBy("omnidetector");
	}
	get filters(): Cell[] {
		return this.filteredBy("filter");
	}
	get walls(): Cell[] {
		return this.filteredBy("wall");
	}
	get closedGates(): Cell[] {
		return this.filteredBy("gate").filter(gate => !gate.active);
	}
	get openedGates(): Cell[] {
		return this.filteredBy("gate").filter(gate => gate.active);
	}
	get absorbers(): Cell[] {
		return this.detectors.concat(
			this.mines,
			this.rocks,
			this.omnidetectors,
			this.filters,
			this.walls,
			this.closedGates
		);
	}

	// Polarizers
	get absorbPolarizers(): Cell[] {
		return this.filteredBy("absorb-polarizer");
	}
	get waveplates(): Cell[] {
		return this.filteredBy("waveplate");
	}
	get sugars(): Cell[] {
		return this.filteredBy("sugar");
	}
	get faradays(): Cell[] {
		return this.filteredBy("faraday");
	}
	get polarizers(): Cell[] {
		return this.absorbPolarizers.concat(this.waveplates, this.sugars, this.faradays);
	}

	// Phasers
	get phaseincs(): Cell[] {
		return this.filteredBy("phaseinc");
	}
	get phasedecs(): Cell[] {
		return this.filteredBy("phasedec");
	}
	get phaseshifters(): Cell[] {
		return this.phasedecs.concat(this.phaseincs);
	}

	// Select cells by type
	public filteredBy(name: string): Cell[] {
		return this.cells.filter(cell => {
			return cell.element.name === name;
		});
	}
	// Select cells by not type
	public filteredByNot(name: string): Cell[] {
		return this.cells.filter(cell => {
			return cell.element.name !== name;
		});
	}

	// Test if coord is inside boundaries
	public includes(coord: Coord): boolean {
		return coord.y >= 0 && coord.y < this.rows && (coord.x >= 0 && coord.x < this.cols);
	}

	// Set one cell
	public set(cell: Cell): boolean {
		if (this.includes(cell.coord)) {
			this.matrix[cell.coord.y][cell.coord.x] = cell;
			return true;
		} else {
			// throw new RangeError(`Coordinate out of bounds. Cell: [${cell.coord.x}, ${cell.coord.y}]`)
			// console.error(`Coordinate out of bounds. ${cell.coord.toString()}`)
			return false;
		}
	}

	// Get one cell - Does not check if coord is in grid
	public get(coord: Coord): Cell {
		return this.matrix[coord.y][coord.x];
	}

	// Set many cells
	public setMany(...cells: Cell[]): boolean {
		let errorToggle = true;
		cells.forEach((cell: Cell) => {
			if (!this.includes(cell.coord)) {
				errorToggle = false;
			}
		});
		cells.forEach(cell => {
			this.set(cell);
		});
		return errorToggle;
	}

	// Get many cells
	public getMany(...coords: Coord[]): Cell[] {
		return coords.map(coord => {
			return this.get(coord);
		});
	}

	// Move from a coord to another
	public move(src: Coord, dst: Coord): boolean {
		const cellSrc = this.get(src);
		const cellDst = this.get(dst);
		if (!cellSrc.frozen && !cellDst.frozen) {
			this.set(new Cell(src, cellDst.element, cellDst.rotation));
			this.set(new Cell(dst, cellSrc.element, cellSrc.rotation));
			console.log(`Moved ${cellSrc.element} from ${src.toString()} to ${dst.toString()}`);
			return true;
		} else {
			console.error(`Couldn't move ${cellSrc.element} because of frozen ${dst.toString()}`);
			return false;
		}
	}

	// Distance to exiting grid
	public distanceToEscape(pointer: Pointer): number {
		switch (pointer.direction % 360) {
			case 0: // TOP
				return pointer.y;
			case 90: // RIGHT
				return this.cols - pointer.x - 1;
			case 180: // BOTTOM
				return this.rows - pointer.y - 1;
			case 270: // LEFT
				return pointer.x;
			default:
				throw new Error("Something went wrong with directions...");
		}
	}

	// Basic display
	public display(): void {
		console.log(this.matrix.valueOf());
	}

	// Laser lines
	get laserCoords(): PathPointer[] {
		const laserCoords: PathPointer[] = [];
		const pointers: Pointer[] = [];
		this.activeLasers.map(laser => {
			pointers.push(new Pointer(laser.coord, laser.rotation, 1, 0));
		});
		pointers.forEach(pointer => {
			pointer.laserPath(this, 40).forEach((laserPoint: PathPointer) => {
				if (laserPoint.coord.isIncludedIn(this.coords)) {
					laserCoords.push(laserPoint);
				}
			});
		});
		return laserCoords;
	}

	// Energize cells according to laser paths
	// Should update also the unergizes cells
	energizeCells(paths: PathPointer[]): void {
		const pathCoords: Coord[] = paths.map(pathPointer => pathPointer.coord);
		this.cells.forEach(cell => {
			if (cell.coord.isIncludedIn(pathCoords) && cell.element.name !== "void") {
				cell.energized = true;
			} else {
				cell.energized = false;
			}
		});
	}

	// Activate cells closed to an energized detector
	activateCells(): void {
		this.unvoid.forEach(cell => {
			if (cell.element.name !== "laser") {
				cell.active = false;
			}
			const energizedAdjacent = this.adjacentCells(cell.coord).filter(adjacent => {
				return adjacent.energized && adjacent.element.name === "detector";
			});
			if (energizedAdjacent.length > 0) {
				console.log(`Cell ${cell.toString()} has 1+ active detectors as adjacent cell.`);
				cell.active = true;
			}
		});
	}

	// Retrieve the adjacent cells to a coordinate in the grid
	adjacentCells(coord: Coord): Cell[] {
		const adjacents: Cell[] = [];
		coord.adjacent.forEach(adjacent => {
			if (this.includes(adjacent)) {
				adjacents.push(this.get(adjacent));
			}
		});
		return adjacents;
	}

	// Include particle display in ascii render
	public toString(): string {
		let result = "";
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				const coord = Coord.importJSON({ y: y, x: x });
				result += this.get(coord).ascii;
			}
			result += "\n";
		}
		return result;
	}

	// FIXME: Need to avoid the void cells
	public compress(): Cell[] {
		const cells = this.unvoid;
		const minX = Math.min(...cells.map(cell => cell.coord.x));
		const minY = Math.min(...cells.map(cell => cell.coord.y));
		const maxX = Math.max(...cells.map(cell => cell.coord.x));
		const maxY = Math.max(...cells.map(cell => cell.coord.y));
		const sizeX = maxX - minX;
		const sizeY = maxY - minY;
		console.log(`The most compressed version is: X:${sizeX} Y: ${sizeY}`);

		cells.forEach(cell => {
			cell.coord.x -= minX;
			cell.coord.y -= minY;
		});
		return cells;
	}

	// import cells
	public importJSON(jsonCells: CellInterface[]): void {
		jsonCells.forEach(jsonCell => {
			const cell = Cell.importJSON(jsonCell);
			this.set(cell);
		});
	}

	// export JSON file to save state oi the game
	public exportJSON(): CellInterface[] {
		const cells: CellInterface[] = [];
		this.unvoid.forEach(cell => {
			cells.push(cell.exportCellJSON());
		});
		return cells;
	}
}