<template>
  <div
    class="toolbox-container"
    @drop.prevent="handleDrop"
    @dragover.prevent="handleDragOver"
  >
    <ToolSlot
      v-for="set in toolsets"
      :key="set[0]"
      :set="set"
      @drop.prevent="handleDrop"
      @dragover.prevent="handleDragOver"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ToolSlot from './ToolSlot.vue';

// TODO: DROP EVENT (returning something to the tray)
@Component({
  components: {
    ToolSlot,
  },
})
export default class ToolBox extends Vue {
  @Prop() readonly toolsets!: Array<Object>

  handleDrop(e: DragEvent) {
    const dtObj: {
      x: number,
      y: number,
      element: string,
      originY?: number,
      originX?: number,
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


    this.$store.dispatch('drop', dtObj);
  }

  handleDragOver(e: DragEvent) {
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
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
</style>
