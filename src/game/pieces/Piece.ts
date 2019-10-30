import { Vue, Prop, Component } from 'vue-property-decorator';
import { ICell } from '@/types';

@Component
export default class Piece extends Vue {
	@Prop() readonly cell!: ICell;
	@Prop({ default: '' }) readonly border!: string;
	@Prop({ default: 64 }) readonly tileSize!: number;

	get energized() {
		return this.cell.energized;
	}

	get active() {
		return this.cell.active;
	}
}
