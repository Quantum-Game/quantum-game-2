import Coord from "../Coord";
import Element from "../Element";
import { Cell } from "../Cell";
import Grid from "../Grid";

describe("Grid", () => {
	it("should create grid from col and row", () => {
		const grid = new Grid(3, 6);
		expect(grid instanceof Grid).toBe(true);
		expect(grid.toString()).toEqual("000000\n000000\n000000\n");
	});

	it("should set the value of a cell", () => {
		const grid = new Grid(3, 6);
		const coord = new Coord(1, 5);
		grid.set(new Cell(coord, Element.fromName("mirror")));
		expect(grid.toString()).toEqual("000000\n000002\n000000\n");
	});

	it("should retrieve a cell through its coordinates in the grid", () => {
		const grid = new Grid(3, 6);
		const coord = new Coord(1, 5);
		grid.set(new Cell(coord, Element.fromName("mirror")));
		const cell = grid.get(coord);
		expect(cell.toString()).toEqual("Cell @ [Y:1, X:5] is unfrozen mirror (Phase: 0, Absorption: 0%) rotated 0°");
	});

	it("should forbid placing a cell outside of the grid", () => {
		const grid = new Grid(3, 6);
		const coord = new Coord(4, 4);
		grid.set(new Cell(coord, Element.fromName("mirror")));
		expect(grid.toString()).toEqual("000000\n000000\n000000\n");
	});

	it("should allow to move an element from a cell to another if both are unfrozen", () => {
		const grid = new Grid(3, 6);
		const orig = new Coord(1, 1);
		const dest = new Coord(2, 2);
		grid.set(new Cell(orig, Element.fromName("mirror")));
		grid.move(orig, dest);
		expect(grid.toString()).toEqual("000000\n000000\n002000\n");
	});

	it("should forbid moving an element to another cell if any is frozen", () => {
		const grid = new Grid(3, 6);
		const orig = new Coord(1, 1);
		const dest = new Coord(2, 2);
		grid.set(new Cell(orig, Element.fromName("mirror"), 0, true));
		grid.move(orig, dest);
		expect(grid.toString()).toEqual("000000\n020000\n000000\n");
	});

	it("should allow to filter cells by element type", () => {
		const grid = new Grid(3, 6);
		const coord1 = new Coord(1, 1);
		const coord2 = new Coord(2, 2);
		const mirror1 = new Cell(coord1, Element.fromName("mirror"));
		const mirror2 = new Cell(coord2, Element.fromName("mirror"));
		grid.set(mirror1);
		grid.set(mirror2);
		expect(grid.mirrors).toEqual([mirror1, mirror2]);
	});
});
