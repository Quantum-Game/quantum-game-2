import { CellInterface } from 'quantumweasel';
import Vue from 'vue';
import Component from 'vue-class-component';

// You can declare a mixin as the same style as components.
@Component
export default class setActiveElement extends Vue {
	setActiveElement(e: DragEvent, cell: CellInterface, source: string) {
		const dt = e.dataTransfer;
		if (dt) {
			const updatedDataCell = { ...cell, source };
			dt.setData('text', JSON.stringify(cell));
		}
		this.$emit('setActiveElement', cell);
	}
}
