import Vue from 'vue';
import Component from 'vue-class-component';
import { CellInterface } from 'quantumweasel';
import { IHint } from '@/types';

@Component
export default class getPostion extends Vue {
	cell!: CellInterface;
	hint!: IHint;
	tileSize!: number;

	coord = {
		x: 0,
		y: 0
	};

	created() {
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

	get transformOriginX() {
		return this.centerCoord(this.coord.x);
	}

	get transformOriginY() {
		return this.centerCoord(this.coord.y);
	}
}
