import Coord from "./Coord";
import { Glyph } from "./Glyph";

export const enum ActorType {
	Player,
	Pointer
}

export interface Actor {
	coord: Coord;
	glyph: Glyph;
	type: ActorType;

	act(): Promise<string>;
}
