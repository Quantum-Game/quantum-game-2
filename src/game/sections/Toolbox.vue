+<template>
  <div class="toolbox">
    <svg v-for="(tool, index) in refinedTools" :key="index" class="tool">
      <q-cell :cell="tool[0]" :tool="true" />
      x {{ tool[1] }}
    </svg>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import countBy from 'lodash.countby';
import { Cell } from 'quantumweasel';
import QCell from '../QCell.vue';

interface Tool {
  element: string;
  count: number;
}

@Component({
  components: {
    QCell
  }
})
export default class Toolbox extends Vue {
  @Prop() readonly tools!: Cell[];
  created() {
		this.processTools();
  }

	processTools() {
		const elements = this.tools.map(cell => cell.element.name);
		console.log(countBy(elements));
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
    width: 33%;
    min-width: 64px;
    padding: 0.5rem 0rem;
  }
}
</style>
