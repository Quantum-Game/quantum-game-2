import Vue from 'vue';
import Component from 'vue-class-component';
import { Cell } from '@/engine/main';
import { IHint } from '@/types';

@Component
export default class getPostion extends Vue {
	cell!: Cell;
	hint!: IHint;
	tileSize!: number;

	coord = {
		x: 0,
		y: 0
	};

	created() {
		this.setCoordOrigin();
	}

	updated() {
		this.setCoordOrigin();
	}

	setCoordOrigin() {
		if (this.hint) {
			this.coord = this.hint.coord;
		} else {
			this.coord = this.cell.coord;
		}
	}

	centerCoord(val: number) {
		return (val + 0.5) * this.tileSize;
	}

	get positionX() {
		return this.coord.x * this.tileSize;
	}

	get positionY() {
		return this.coord.y * this.tileSize;
	}

	get translationX(): number {
		return this.cell.coord.x * this.tileSize;
	}

	get translationY(): number {
		return this.cell.coord.y * this.tileSize;
	}

	get transformOriginX() {
		return this.centerCoord(this.coord.x);
	}

	get transformOriginY() {
		return this.centerCoord(this.coord.y);
	}
}
