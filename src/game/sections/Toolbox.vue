<template>
	<div class="toolbox">
		<svg v-for="(toolName, index) in toolboxKeys" :key="index" class="tool">
			<q-cell :cell="getFakeCell(toolName)" :tool="true" />
			<text class="counter" x="25" y="80">x {{ toolbox[toolName] }}</text>
		</svg>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import countBy from 'lodash.countby';
import { Cell, Element, Coord } from 'quantumweasel';
import QCell from '../QCell.vue';

interface Tool {
	[symbol: string]: number;
}

@Component({
	components: {
		QCell
	}
})
export default class Toolbox extends Vue {
	@Prop() readonly tools!: Cell[];
	toolbox: Tool = {};

	created() {
		this.processTools();
	}

	getFakeCell(name: string): Cell {
		const coord = new Coord(-1, -1);
		const element = Element.fromName(name);
		return new Cell(coord, element);
	}

	get toolboxKeys(): string[] {
		return Object.keys(this.toolbox);
	}

	/*	watcher here is a provisional way of the internal
			toolbox property reevaluated on props change
	*/
	@Watch('tools')
	processTools() {
		const elements = this.tools.map((cell) => cell.element.name);
		this.toolbox = countBy(elements);
	}
}
</script>

<style lang="scss" scoped>
.toolbox {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
	width: 100%;
	border-top: 1px solid white;
	padding-top: 10px;
	padding-bottom: 10px;
	& h3 {
		margin: 0;
	}
	.tool {
		width: 30%;
		min-width: 64px;
		padding: 0.5rem 0rem;
		height: 90px;
	}
	.counter {
		fill: white;
		stroke: white;
	}
}
</style>
