<template>
  <div
    class="tool"
    draggable="true"
    @dragstart="handleElementDragStart"
  >
    {{ set[0] }} x {{ set[1] }}
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Emit,
} from 'vue-property-decorator';

@Component
export default class ToolSlot extends Vue {
  @Prop() readonly set!: [string, number]

  handleElementDragStart(e: DragEvent) {
    const dt = e.dataTransfer;
    if (dt) {
      dt.setData('text/plain', this.set[0]);
    }
  }
}
</script>

<style lang="scss">
  .tool {
    width: 100%;
    background-color: purple;
    height: 50px;
    margin-bottom: 10px;
    color: white;
  }

</style>
