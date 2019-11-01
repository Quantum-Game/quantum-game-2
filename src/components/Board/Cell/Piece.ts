import { Vue, Prop, Component } from 'vue-property-decorator';
import { Cell } from '@/engine/classes';

@Component
export default class Piece extends Vue {
	@Prop() readonly cell!: Cell;
	@Prop({ default: '' }) readonly border!: string;
	@Prop({ default: 64 }) readonly tileSize!: number;

	get energized() {
		return this.cell.energized;
	}

	get active() {
		return this.cell.active;
	}
}
