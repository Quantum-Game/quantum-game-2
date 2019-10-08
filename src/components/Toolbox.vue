<template>
  <div
    class="toolbox-container"
    @drop.prevent="handleDrop"
    @dragover.prevent="handleDragOver"
  >
    <div
      v-for="set in toolState"
      :key="set[0].element"
      class="toolslot"
      :class="{'tool': true, active: !isSetEmty(set)}"
    >
      <piece
        :disabled="isSetEmty(set)"
        :cell="set[0]"
      />
      x {{ set[1] }}
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
} from 'vue-property-decorator';
import Piece from './Piece.vue';
import EventBus from '../eventbus';

@Component({
  components: {
    Piece,
  },
})
export default class ToolBox extends Vue {
  @Prop() readonly toolsets!: Array<Object>

  toolState = this.toolsets;

  @Watch('toolsets')
  updateState() {
    this.toolState = this.toolsets;
  }

  created() {
    EventBus.$on('removeFromToolbox', this.removeTool);
  }

  /* eslint-disable class-methods-use-this */
  beforeDestroy() {
    EventBus.$off('removeFromToolbox');
  }

  // TODO: debounce drops from toolbox earlier:
  handleDrop(e: DragEvent) {
    const dtObj: {
      x: number,
      y: number,
      element: string,
      originY: number,
      originX: number,
    } = {
      x: -1,
      y: -1,
      element: '',
      originX: -1,
      originY: -1,
    };
    const dt = e.dataTransfer;
    if (dt) {
      dtObj.element = dt.getData('text/plain');
      dtObj.originY = Number(dt.getData('originY'));
      dtObj.originX = Number(dt.getData('originX'));
    }

    if (dtObj.originY > -1 && dtObj.originX > -1) {
      this.addTool(dtObj);
      console.log('should be removerd');
      EventBus.$emit('removeFromBoard', dtObj);
    }
  }

  addTool(tool: {element: string}) {
    const setToAlter: [{element: string}, number] | undefined = this.toolState.find((set) => {
      return set[0].element === tool.element;
    });
    const toolsetIndex = this.toolState.indexOf(setToAlter);

    if (setToAlter) {
      const setQuantity = setToAlter[1];
      const alteredQuantity = setQuantity + 1;
      const alteredSet = [setToAlter[0], alteredQuantity];

      this.toolState.splice(toolsetIndex, 1, alteredSet);
    }
  }

  removeTool(cell) {
    const toolToRemove = this.toolState.find(toolset => toolset[0].element === cell.element);
    const index = this.toolState.indexOf(toolToRemove);
    const lessenedQuantity = toolToRemove[1] - 1;
    const smallerToolSet = [toolToRemove[0], lessenedQuantity];

    this.toolState.splice(index, 1, smallerToolSet);
  }

  handleDragOver(e: DragEvent) {
    // if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
    // }
  }

  get isSetEmty() {
    return set => set[1] < 1;
  }
}
</script>

<style lang="scss">
  .toolbox-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    min-height: 500px;
    width: 20%;
    margin-left: 10px;
  }

  .tool {
    width: 70px;
    height: 100px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
    font-size: 1.3rem;
    padding-top: 10px;
    background-color: rgba(5, 108, 121, 0.397);
  }


  .active {
    background-color: purple;
  }
</style>
