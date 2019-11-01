import { Vue, Prop, Component } from 'vue-property-decorator';
import { CellInterface } from '@/engine/interfaces';

@Component
export default class Piece extends Vue {
	@Prop() readonly cell!: CellInterface;
	@Prop({ default: '' }) readonly border!: string;
	@Prop({ default: 64 }) readonly tileSize!: number;

	get energized() {
		return this.cell.energized;
	}

	get active() {
		return this.cell.active;
	}
}
