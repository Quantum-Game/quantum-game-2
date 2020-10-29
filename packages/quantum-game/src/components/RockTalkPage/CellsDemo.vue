<template>
  <div class="cell-demo" layout="column middle center u10">
    <div layout="row wrap middle">
      <div v-for="cell in cells" :key="cell.name" class="cell" layout="column center u2">
        <span>{{ cell.name }}</span>
        <svg viewBox="0 0 64 64" width="64" height="64">
          <component :is="cell.component" :state="pieceState" />
        </svg>
      </div>
    </div>
    <div class="form" layout="inline column u2 start">
      <label><input v-model="pieceState.hover" type="checkbox" /> hover</label>
      <label><input v-model="pieceState.interacting" type="checkbox" /> interacting</label>
      <label><input v-model="pieceState.energized" type="checkbox" /> energized</label>
      <label
        ><input v-model="pieceState.goalProgress" type="range" step="0.1" min="0" max="1" /> goal
        progress</label
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Elem } from '@/engine/model'
import { isDef } from '@/types'
import { computed, defineComponent, Ref, ref } from 'vue'
import { elementComponents } from '../Board/Cell'
import { PieceState } from '../Board/Cell/Piece'
export default defineComponent({
  setup() {
    const pieceState: Ref<PieceState> = ref({
      hover: false,
      interacting: false,
      energized: false,
      goalProgress: 0,
    })

    return {
      cells: computed(() =>
        Object.entries(elementComponents)
          .filter((entry) => isDef(entry[1]))
          .map(([elem, component]) => ({ component, name: Elem[+elem] }))
      ),
      pieceState,
    }
  },
})
</script>
<style lang="scss" scoped>
.cell-demo {
  margin: auto;
  max-width: 1000px;
  padding: 0 50px;
}

.cell {
  color: $orange;
  font-size: 0.8em;
  margin: 20px;
}

.form {
  font-size: 1.2em;
  input {
    width: 25px;
    height: 25px;
    vertical-align: middle;
  }
}
</style>
