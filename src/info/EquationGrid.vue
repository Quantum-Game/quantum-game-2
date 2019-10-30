<template>
	<div class="container">
		<div>
			<h2>{{ elementName }} at {{ rotation }}°</h2>
			<OperatorViewer
				:labels-in="basis"
				:labels-out="basis"
				:matrix-elements="matrixElements"
				:height="300"
				:width="300"
				:size="30"
				:margin="20"
			/>
			<div class="egrid">
				<Egrid :level="level" :step="step" class="board" />
			</div>
			<div>
				<span>Select dimension order:</span>
				<select v-model="dimOrder">
					<option value="dir pol">dir pol</option>
					<option value="pol dir">pol dir</option>
				</select>
				<div class="operatorText">{{ operator }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import cloneDeep from 'lodash.clonedeep';
import { Vue, Prop, Component } from 'vue-property-decorator';
import * as qt from 'quantum-tensors';
import {
	Coord,
	Level,
	Element,
	Particle,
	Frame,
	Grid,
	Cell,
	ParticleInterface,
	CellInterface,
	LevelInterface
} from 'quantumweasel';
import OperatorViewer from './OperatorViewer.vue';
import Egrid from '../game/sections/EGrid.vue';

@Component({
	components: {
		Egrid,
		OperatorViewer
	}
})
export default class EquationGrid extends Vue {
	@Prop({ default: 'Mirror' }) readonly elementName!: string;
	@Prop({ default: '0' }) readonly rotation!: number;
	@Prop({ default: 5 }) readonly step!: number;
	element = Element.fromName(this.elementName);
	coord = new Coord(1, 1);
	cell = new Cell(this.coord, this.element, this.rotation);
	level: Level = Level.importLevel({
		id: 1337,
		name: this.elementName,
		group: 'Encyclopedia',
		description: this.elementName,
		grid: {
			cols: 3,
			rows: 3,
			cells: [
				{
					coord: { x: 0, y: 1 },
					element: 'Laser',
					rotation: 0,
					active: true,
					frozen: true
				},
				{
					coord: { x: 1, y: 1 },
					element: this.elementName,
					rotation: this.rotation,
					active: false,
					frozen: false
				}
			]
		},
		hints: [],
		goals: []
	});
	dimOrder = 'dir pol';

	$refs!: {
		grid: HTMLElement;
	};

	get operator() {
		const cell = this.level.grid.get(this.coord);
		return cell.element.transition(cell.rotation);
	}

	get basis() {
		if (this.dimOrder === 'dir pol') {
			return ['⇢↔', '⇢↕', '⇡↔', '⇡↕', '⇠↔', '⇠↕', '⇣↔', '⇣↕'];
		}
		return ['↔⇢', '↔⇡', '↔⇠', '↔⇣', '↕⇢', '↕⇡', '↕⇠', '↕⇣'];
	}

	get matrixElements() {
		if (this.dimOrder === 'dir pol') {
			return this.operator.entries.map((entry) => {
				return {
					i: 2 * entry.coordIn[0] + entry.coordIn[1],
					j: 2 * entry.coordOut[0] + entry.coordOut[1],
					re: entry.value.re,
					im: entry.value.im
				};
			});
		}
		return this.operator.entries.map((entry) => {
			return {
				i: entry.coordIn[0] + 4 * entry.coordIn[1],
				j: entry.coordOut[0] + 4 * entry.coordOut[1],
				re: entry.value.re,
				im: entry.value.im
			};
		});
	}

	/**
	 * Temporary! I want to work with actual quantum states.
	 * Also - quick, dirty, no-LaTeX and pure string
	 */
	frameToKet(frame: Frame): string {
		const dirVis = new Map<number, string>();
		dirVis.set(0, '⇢');
		dirVis.set(90, '⇡');
		dirVis.set(180, '⇠');
		dirVis.set(270, '⇣');

		return frame.quantum
			.flatMap((d) => {
				const res = [];
				if (d.a.re !== 0 || d.a.im !== 0) {
					res.push(
						`(${d.a.re.toFixed(2)} + ${d.a.im.toFixed(2)} i) |${d.coord.x} ${
							d.coord.y
						} ${dirVis.get(d.direction)} H⟩`
					);
				}
				if (d.b.re !== 0 || d.b.im !== 0) {
					res.push(
						`(${d.b.re.toFixed(2)} + ${d.b.im.toFixed(2)} i) |${d.coord.x} ${
							d.coord.y
						} ${dirVis.get(d.direction)} V⟩`
					);
				}
				return res;
			})
			.join(' + ');
	}
}
</script>

<style lang="scss" scoped>
.egrid {
	display: inline-block;
}
.operatorText {
	padding: 10px;
	font-size: 10px;
}
</style>
