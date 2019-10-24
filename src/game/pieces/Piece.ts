import { Vue, Prop } from 'vue-property-decorator';
import { ICell } from '@/types';

export default class Piece extends Vue {
	@Prop() readonly cell!: ICell;

	get energized() {
		return this.cell.energized;
	}

	get active() {
		return this.cell.active;
	}
}
