// CLUSTER CLASS
// Cluster will be used to display multi-cellular components on the grid.
//  It is a collection of cells with an emergent behaviour.

import Coord from "./Coord";
import Element from "./Element";
import { Cell, CellInterface } from "./Cell";

export default class Cluster {
	cells: Cell[];

	// Allow constructor with origin coord, number array and direction
	constructor(cells: Cell[]) {
		// Find the smallest container
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
		this.cells = cells;
	}

	// Retrieve list of coordinates of the cluster
	get coords(): Coord[] {
		return this.cells.map(cell => cell.coord);
	}

	// Retrieve list of elements of the cluster
	get elements(): Element[] {
		return this.cells.map(cell => cell.element);
	}

	// Origin of the cluster is the first element coordinates.
	get origin(): Coord {
		return this.cells[0].coord;
	}

	// import cells
	public importJSON(jsonCells: CellInterface[]): void {
		jsonCells.forEach(jsonCell => {
			const cell = Cell.importJSON(jsonCell);
			this.cells.push(cell);
		});
	}

	//FIXME: Code close to the Grid code
	// export JSON file to save state oi the game
	public exportJSON(): CellInterface[] {
		const cells: CellInterface[] = [];
		this.cells
			.filter(cell => {
				return cell.element.name !== "void";
			})
			.forEach((cell: { exportCellJSON: () => CellInterface }) => {
				cells.push(cell.exportCellJSON());
			});
		return cells;
	}
}
