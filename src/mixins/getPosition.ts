import { Cell } from 'quantumweasel';
import Vue from 'vue';
import Component from 'vue-class-component';
import { IHint } from '@/types';

@Component
export default class getPosition extends Vue {
	cell!: Cell;
	tileSize!: number;
	hint!: IHint;

	centerCoord(val: number): number {
		return (val + 0.5) * this.tileSize;
	}

	get rotationOriginX() {
		return this.centerCoord(this.x);
	}

	get rotationOriginY() {
		return this.centerCoord(this.y);
	}

	get positionX() {
		return this.x * this.tileSize;
	}

	get positionY() {
		return this.y * this.tileSize;
	}

	get x() {
		if (this.hint) {
			return this.hint.coord.x;
		}
		return this.cell.coord.x;
	}

	get y() {
		if (this.hint) {
			return this.hint.coord.y;
		}
		return this.cell.coord.y;
	}

	get rotation() {
		if (this.hint) {
			return 0;
		}
		return this.cell.rotation;
	}
}
