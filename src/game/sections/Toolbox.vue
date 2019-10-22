+<template>
	<div class="toolbox">
		<div v-for="(tool, index) in refinedTools" :key="index" class="tool">
			<tile :cell="tool[0]" />
			x {{ tool[1] }}
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Tile from '@/game/Tile.vue';

@Component({
	components: {
		Tile
	}
})
export default class Toolbox extends Vue {
	@Prop() readonly tools!: Array<any>;
	refinedTools: Array<Array<any>> = [
		[
			{
				element: 'void'
			},
			0
		]
	];
	toolNameList: string[] = [];
	created() {
		this.setUpTools();
	}

	@Watch('tools')
	setUpTools() {
		console.log(this.tools);
		this.refinedTools = [];
		this.toolNameList = [];
		// Take every raw cell object and see whether it is included in the toolNameList:
		this.tools.forEach((toolObj: { element: string }) => {
			const isAlreadyTooolboxed = this.toolNameList.includes(toolObj.element);
			// if it is not on the list, add it to it, additionally
			// add it to refinedTools with quantity of 1.
			if (!isAlreadyTooolboxed) {
				this.toolNameList.push(toolObj.element);
				this.refinedTools.push([toolObj, 1]);
				// If the this.toolNameList consists element's name,
				// find its index and assess its quantity
			} else {
				const index = this.toolNameList.indexOf(toolObj.element);
				const quantity = this.refinedTools[index][1];
				// Update the refinedTools array entry:
				const updatedRefinedTool = [this.refinedTools[index][0], quantity + 1];
				this.refinedTools[index] = updatedRefinedTool;
			}
		});
		return this.refinedTools;
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
		width: 33.3%;
		padding: 0.5rem 0.1rem;
	}
}
</style>
