<template>
  <div
    :class="{'tool': true, active: isActive}"
    :draggable="isActive"
    @dragstart="handleElementDragStart"
  >
    <cell
      :cell="cell"
    />
    x {{ set[1] }}
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Emit,
} from 'vue-property-decorator';
import Cell from './Cell.vue';

@Component({
  components: {
    Cell,
  },
})
export default class ToolSlot extends Vue {
  @Prop() readonly set!: [string, number]

  handleElementDragStart(e: DragEvent) {
    const dt = e.dataTransfer;
    if (dt) {
      dt.setData('text/plain', this.set[0]);
      dt.setData('originY', '-1');
      dt.setData('originX', '-1');
    }
  }

  get isActive() {
    return this.set[1] > 0;
  }

  get cell() {
    return {
      element: this.set[0],
      frozen: false,
      x: -1,
      y: -1,
    };
  }
}
</script>

<style lang="scss">
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
