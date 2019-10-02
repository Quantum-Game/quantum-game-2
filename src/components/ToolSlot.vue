<template>
  <div
    :class="{'tool': true, active: isActive}"
    :draggable="isActive"
    @dragstart="handleElementDragStart"
  >
    <piece
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
import Piece from './Piece.vue';

@Component({
  components: {
    Piece,
  },
})
export default class ToolSlot extends Vue {
  @Prop() readonly set!: [string, number]

  handleElementDragStart(e: DragEvent) {

    // in case there is no more items to drag:
    if (this.set[1] <= 0) {
      const dt = e.dataTransfer;
      if (dt) {
        dt.clearData();
      }
      return false;
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
