import { KEYS } from "rot-js";
import { Glyph } from "./Glyph";
import { Actor, ActorType } from "./Actor";
import InputUtility from "./InputUtility";
import Coord from "./Coord";
import { Cell } from "./Cell";
import Game from "./Game";
import Element from "./Element";
import FileSaver = require("file-saver");
import { jsonGroups } from "../data/elements";

export default class Player implements Actor {
	glyph: Glyph;
	type: ActorType;
	private game: Game;
	public coord: Coord;

	constructor(game: Game, coord: Coord) {
		this.glyph = new Glyph("@", [0, 0]);
		this.type = ActorType.Player;
		this.game = game;
		this.coord = coord;
	}

	// Getters and setters
	get cell(): Cell {
		return this.game.grid.get(this.coord);
	}
	// Getters and setters
	get element(): Element {
		return this.cell.element;
	}

	// tslint:disable-next-line: no-any
	act(): Promise<string> {
		return InputUtility.waitForInput(this.handleInput.bind(this));
	}

	// Cycle through groups of elements
	cycleNext(group: string): void {
		const list: string[] = jsonGroups[group];
		if (this.cell.frozen) {
			return;
		}
		// Cycle through elements of the same group
		if (group === this.element.group) {
			const elemIndex = (list.indexOf(this.element.name) + 1) % list.length;
			this.cell.element = Element.fromName(list[elemIndex]);
		} else {
			this.cell.rotation = 0;
			this.cell.element = Element.fromName(list[0]);
		}
	}

	// Offset of movement
	private handleInput(event: KeyboardEvent): boolean {
		let validInput = false;
		let newCoord: Coord = this.coord;
		switch (event.keyCode) {
			// Movement
			case KEYS.VK_Z:
			case KEYS.VK_UP:
				newCoord = this.coord.top;
				break;
			case KEYS.VK_D:
			case KEYS.VK_RIGHT:
				newCoord = this.coord.right;
				break;
			case KEYS.VK_S:
			case KEYS.VK_DOWN:
				newCoord = this.coord.bottom;
				break;
			case KEYS.VK_Q:
			case KEYS.VK_LEFT:
				newCoord = this.coord.left;
				break;

			// Rotations, freezing, activation
			case KEYS.VK_A:
				this.cell.rotate(-this.cell.element.rotationAngle);
				break;
			case KEYS.VK_E:
				this.cell.rotate(this.cell.element.rotationAngle);
				break;
			case KEYS.VK_F:
				this.cell.toggleFreeze();
				break;
			case KEYS.VK_CONTROL:
				this.cell.toggleActive();
				break;

			// Save JSON file with level
			case KEYS.VK_F1:
				const json = this.game.level.exportJSON();
				const blob = new Blob([JSON.stringify(json)], {
					type: "text/plain;charset=utf-8"
				});
				FileSaver.saveAs(blob, "level.json");
				break;

			// Elements
			// Cycle through elements in group
			case KEYS.VK_QUOTE:
				this.cycleNext("Basic");
				break;
			case KEYS.VK_1:
				this.cycleNext("Emitter");
				break;
			case KEYS.VK_2:
				this.cycleNext("Direction");
				break;
			case KEYS.VK_3:
				this.cycleNext("Absorption");
				break;
			case KEYS.VK_4:
				this.cycleNext("Polarization");
				break;
			case KEYS.VK_5:
				this.cycleNext("Phase");
				break;
			default:
				break;
		}
		// Check that player is in game grid borders
		if (this.game.grid.includes(newCoord)) {
			this.coord = newCoord;
			validInput = true;
		}
		return validInput;
	}

	toString(): string {
		return `Player ${this.coord.toString()}`;
	}
}
