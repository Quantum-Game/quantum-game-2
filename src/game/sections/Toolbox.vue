<template>
	<div class="toolbox">
		<svg v-for="(toolName, index) in toolboxKeys" :key="index" class="tool">
			<q-cell :cell="getFakeCell(toolName)" :tool="true" />
			<text class="counter" x="25" y="80">x {{ toolbox[toolName] }}</text>
		</svg>
		<slot> isMoving: {{ isMoving }} activeCell: {{ activeCell.toString() }} </slot>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import countBy from 'lodash.countby';
import { Cell, Element, Coord } from '@/engine/main';
import { State } from 'vuex-class';
import QCell from '../QCell.vue';
import { REMOVE_FROM_CURRENT_TOOLS } from '@/store/mutation-types';

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
	@State isMoving!: boolean;
	@State activeCell!: Cell;

	created() {
		this.processTools();
	}

	addTool(cell: Cell) {
		const { name } = cell.element;
		this.toolbox[name] += 1;
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

	removeTool(cell: Cell) {
		const { name } = cell.element;
		this.toolbox[name] -= 1;
	}
}
//   @Watch('tools')
//   setUpTools() {
//     this.refinedTools = [];
//     this.toolNameList = [];
//     // Take every raw cell object and see whether it is included in the toolNameList:
//     this.tools.forEach((toolObj: { element: string }) => {
//       const isAlreadyTooolboxed = this.toolNameList.includes(toolObj.element);
//       // if it is not on the list, add it to it, additionally
//       // add it to refinedTools with quantity of 1.
//       if (!isAlreadyTooolboxed) {
//         this.toolNameList.push(toolObj.element);
//         this.refinedTools.push([toolObj, 1]);
//         // If the this.toolNameList consists element's name,
//         // find its index and assess its quantity
//       } else {
//         const index = this.toolNameList.indexOf(toolObj.element);
//         const quantity = this.refinedTools[index][1];
//         // Update the refinedTools array entry:
//         const updatedRefinedTool = [this.refinedTools[index][0], quantity + 1];
//         this.refinedTools[index] = updatedRefinedTool;
//       }
//     });
//     return this.refinedTools;
//   }
// }
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
