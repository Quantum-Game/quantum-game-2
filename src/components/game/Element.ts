/* eslint-disable @typescript-eslint/no-non-null-assertion */
// ELEMENT CLASS
// Basic class related to game elements
// FIXME: This class needs rewrite with glyphs and func

import { jsonElements } from "./data/elements";
import { Glyph } from "./Glyph";

export interface ElementInterface {
	id: number;
	name: string;
	group: string;
	description: string;
	link: string;
	active: boolean;
	absorption: number;
	phase: number;
	matrix: number[][];
	foregroundColor: string;
	backgroundColor: string;
	ascii: string[];
	tiles: number[][];
	glyph: Glyph;
}

export default class Element {
	id: number;
	name: string;
	group: string;
	description: string;
	link: string;
	active: boolean;
	absorption: number;
	phase: number;
	matrix: number[][];
	foregroundColor: string;
	backgroundColor: string;
	ascii: string[];
	tiles: number[][];
	glyph: Glyph;

	constructor(
		id: number,
		name: string,
		group = "",
		description = "",
		link = "",
		active = false,
		absorption = 0,
		phase = 0,
		matrix: number[][] = [[0, 0], [0, 0]],
		foregroundColor = "white",
		backgroundColor = "black",
		ascii: string[] = [" ", " ", " ", " ", " ", " ", " ", " "],
		tiles: number[][] = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
		glyph: Glyph = new Glyph(" ", [0, 0])
	) {
		this.id = id;
		this.name = name;
		this.group = group;
		this.description = description;
		this.link = link;
		this.active = active;
		this.absorption = absorption;
		this.phase = phase;
		this.matrix = matrix;
		this.foregroundColor = foregroundColor;
		this.backgroundColor = backgroundColor;
		this.ascii = ascii;
		this.tiles = tiles;
		this.glyph = glyph;
	}

	// Compute the rotation angle from the number of sprites
	get rotationAngle(): number {
		return 360 / this.ascii.length;
	}

	// Override of toString() method
	toString(): string {
		return `${this.name} (Phase: ${this.phase}, Absorption: ${this.absorption * 100}%)`;
	}

	// Export JSON
	exportJSON(): ElementInterface {
		return {
			id: this.id,
			name: this.name,
			group: this.group,
			description: this.description,
			link: this.link,
			active: this.active,
			absorption: this.absorption,
			phase: this.phase,
			matrix: this.matrix,
			foregroundColor: this.foregroundColor,
			backgroundColor: this.backgroundColor,
			ascii: this.ascii,
			tiles: this.tiles,
			glyph: this.glyph
		};
	}

	// Use the element id to get their row in the tilemap file multiplied bu the tile size
	// static processTileMap(tilesize = 64): { [x: number; y: number]: string } {
	static processTileMap(tilesize = 64): { [symbol: string]: [number, number] } {
		const tileMap: { [symbol: string]: [number, number] } = {};
		jsonElements.forEach(elem => {
			elem.tiles.forEach((_tile, index) => {
				const y = elem.id * tilesize;
				const x = index * tilesize;
				// console.log(`Processing ${elem.name}: Position: ${elem.ascii[index]} - [X:${x}, Y:${y}]`);
				tileMap[elem.ascii[index]] = [x, y];
			});
		});
		return tileMap;
	}

	// Static JSON load
	// FIXME: It's goddamn ugly
	static fromName(name: string, version = 2): Element {
		if (version === 2) {
			const elem = jsonElements.find((elem: { name: string; tiles: number[][] }) => {
				return elem.name === name;
			});
			return new Element(
				elem!.id,
				elem!.name,
				elem!.group,
				elem!.description,
				elem!.link,
				elem!.active,
				elem!.absorption,
				elem!.phase,
				elem!.matrix,
				elem!.foregroundColor,
				elem!.backgroundColor,
				elem!.ascii,
				elem!.tiles
			);
		} else {
			const elem = jsonElements.find((elem: { namev1: string; tiles: number[][] }) => {
				return elem.namev1 === name;
			});
			return new Element(
				elem!.id,
				elem!.name,
				elem!.group,
				elem!.description,
				elem!.link,
				elem!.active,
				elem!.absorption,
				elem!.phase,
				elem!.matrix,
				elem!.foregroundColor,
				elem!.backgroundColor,
				elem!.ascii,
				elem!.tiles
			);
		}
	}
}
