<template>
 <div class="toolbox-container">
  <!-- <div
			v-for="name in slotNames"
			:key="name"
			:class="{ tool: true, active: slots[name] > 0 }"
			@mousedown="handleMouseDown($event, name)"
			@dragstart="handleDragStart($event, name)"
		>
			<piece :disabled="slots[name] < 1" :cell="{ element: name }" @elementDragging="onDrag"	/>
			x {{ slots[name] }}
  </div>-->
 </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// import { mixins } from 'vue-class-component';
// import { ICell, IToolset } from '../types';
// import { setActiveElement } from '../mixins';

// const EventBus = require('../eventbus');
// import Piece from './Piece.vue';mixins(setActiveElement)

@Component({
 components: {
  // Piece
 }
})
export default class ToolBox extends Vue {
 // @Prop() readonly initialTools!: Array<Object>;
 // currentTools: Array<Object> = this.initialTools.slice();
 // slots: IToolset = {};
 // created() {
 // 	EventBus.$on('removeFromToolbox', this.removeTool);
 // 	this.setUpSlots();
 // }
 // setUpSlots() {
 // 	const copyOfInitialTools = {...this.initialTools};
 // 	this.currentTools.forEach((toolObj: ICell) => {
 // 		if (!this.slots[toolObj.element]) {
 // 			this.slots[toolObj.element] = 1;
 // 		} else {
 // 			this.slots[toolObj.element] += 1;
 // 		}
 // 	});
 // }
 // get slotNames() {
 // 	return Object.keys(this.slots);
 // }
 // onDrag(payload) {
 // 	this.$emit('elementDragging', payload);
 // }
 // get groupedTrayCells() {
 // 	if (!this.initialTools.length) {
 // 		return false;
 // 	}
 // 	const refinedTools: [object, number][] = [];
 // 	const toolNameList: string[] = [];
 // 	// Take every raw cell object and see whether it is included in the toolNameList:
 // 	this.currentTools.forEach((toolObj: { element: string }) => {
 // 		const isAlreadyTooolboxed = toolNameList.includes(toolObj.element);
 // 		// if it is not on the list, add it to it, additionally
 // 		// add it to refinedTools with quantity of 1.
 // 		if (!isAlreadyTooolboxed) {
 // 			toolNameList.push(toolObj.element);
 // 			refinedTools.push([toolObj, 1]);
 // 			// If the toolNameList consists element's name,
 // 			// find its index and assess its quantity
 // 		} else {
 // 			const index = toolNameList.indexOf(toolObj.element);
 // 			const quantity = refinedTools[index][1];
 // 			// Update the refinedTools array entry:
 // 			const updatedRefinedTool = [refinedTools[index][0], quantity + 1];
 // 			refinedTools[index] = updatedRefinedTool;
 // 		}
 // 	});
 // 	return refinedTools;
 // }
 // /* eslint-disable class-methods-use-this */
 // beforeDestroy() {
 //	 EventBus.$off('removeFromToolbox');
 // }
 // // TODO: debounce drops from toolbox earlier:
 // handleDrop(e: DragEvent) {
 // 	const dt = e.dataTransfer;
 // 	if (!dt || dt.dropEffect) {
 // 		this.addTool({ element: dt.getData('element') });
 // 	}
 //	 // const dtObj: {
 //	 //	 x: number,
 //	 //	 y: number,
 //	 //	 element: string,
 //	 //	 originY: number,
 //	 //	 originX: number,
 // 	// } = {
 // 	// 	x: -1,
 // 	// 	y: -1,
 // 	// 	element: '',
 // 	// 	originX: -1,
 // 	// 	originY: -1,
 //	 // };
 //	 // const dt = e.dataTransfer;
 //	 // if (dt) {
 //	 //	 dtObj.element = dt.getData('text/plain');
 //	 //	 dtObj.originY = Number(dt.getData('originY'));
 //	 //	 dtObj.originX = Number(dt.getData('originX'));
 //	 // }
 //	 // if (dtObj.originY > -1 && dtObj.originX > -1) {
 //	 //	 console.log('should be removerd');
 //		 // EventBus.$emit('removeFromBoard', dtplayers Obj);
 // // }
 // }
 // addTool(tool: ICell) {
 //	 // const setToAlter: [{element: string}, number] | undefined = this.currentTools.find((set) => {
 //	 //	 return set[0].element === tool.element;
 //	 // });
 //	 // const toolsetIndex = this.currentTools.indexOf(setToAlter);
 //	 // if (setToAlter) {
 //	 //	 const setQuantity = setToAlter[1];
 //	 //	 const alteredQuantity = setQuantity + 1;
 //	 //	 const alteredSet = [setToAlter[0], alteredQuantity];
 // 		// this.currentTools.splice(toolsetIndex, 1, alteredSet);
 // 	this.currentTools.push(tool);
 // }
 // removeTool(cell) {
 // 	const toolToRemove = this.currentTools.find((tool: Array<[ICell, number]>) => tool[0] === cell.element);
 // 	const index = this.currentTools.indexOf(toolToRemove);
 // 	this.currentTools.splice(index, 1);
 // }
 // handleMouseDown(event, toolName) {
 // 	this.setActiveElement(event, { element: toolName, source: 'tray' });
 // }
 // handleDragStart(event, toolset) {
 // 	// this.setDragging(event)
 // }
 // handleDragEnd(e) {
 // 	const dt = e.dataTransfer;
 // 	console.log(dt.dropEffect);
 // }
}
</script>

<style lang="scss" scoped>
.toolbox-container {
 display: flex;
 flex-direction: row;
 flex-wrap: wrap;
 padding: 20px 0;
 flex-wrap: wrap;
 border-top: 3px solid white;
 border-bottom: 2px solid white;
 min-height: 64px;
 & .tool {
  width: 33%;
  height: 33%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  font-size: 10rem;
  padding-top: 10px;
  .active {
   background-color: purple;
  }
 }
}
</style>
