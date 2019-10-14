import Vue from 'vue';
import Component from 'vue-class-component';
import { ICell } from '@/types';

// You can declare a mixin as the same style as components.
@Component
export default class setActiveElement extends Vue {
	setActiveElement(e: DragEvent, cell: ICell, source: string) {
		const dt = e.dataTransfer;
		if (dt) {
			const updatedDataCell = { ...cell, source };
			dt.setData('text', JSON.stringify(cell));
		}
		this.$emit('setActiveElement', cell);
	}
}
