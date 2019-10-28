import { Cell } from 'quantumweasel';
import Vue from 'vue';
import Component from 'vue-class-component';
import bus from '@/eventbus';

// You can declare a mixin as the same style as components.
@Component
export default class setActiveCell extends Vue {
	setActiveCell(cell: Cell) {
		// console.log(cell.toString());
		bus.$emit('setActiveCell', cell);
	}
}
