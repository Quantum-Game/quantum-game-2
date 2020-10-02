<template>
  <div v-if="gameCtl.level" class="container">
    <board
      class="board"
      :absorptions="gameCtl.sim.absorptions"
      :board="gameCtl.level.board"
      :laser-particles="laserParticles"
      :particles="playheadCtl.interpolatedParticles"
      @touch="updateRotation"
    />
    <board-frame-picker :playhead="playheadCtl" />
    <div class="ket">
      <ket-viewer :key="polBasis" :vector="playheadCtl.activeFrame.vector" :pol-basis="polBasis" />
    </div>
  </div>
</template>

<script lang="ts">
import { KetViewer } from 'bra-ket-vue'
import Board from '@/components/Board/index.vue'
import BoardFramePicker from './BoardFramePicker.vue'
import { computed, defineComponent, PropType } from 'vue'
import { gameController, playheadController } from '@/engine/controller'
import { IGrid } from '@/engine/interfaces'
import { Coord, Rotation, Vector } from '@/engine/model'

export default defineComponent({
  components: {
    Board,
    KetViewer,
    BoardFramePicker,
  },
  props: {
    grid: { type: Object as PropType<IGrid>, required: true },
    vector: { type: Object as PropType<Vector>, required: false },
    maxSteps: { type: Number, required: false },
    defaultStep: { type: Number, required: false },
  },
  emits: {
    rotated: (_: Rotation) => true,
  },
  setup(props, { emit }) {
    const gameCtl = gameController({
      initialState: () => props.vector,
      maxSteps: () => props.maxSteps,
    })

    gameCtl.importLevel({ grid: props.grid })

    const playheadCtl = playheadController({
      frames: () => gameCtl.sim?.frames.filter((f) => f.vector.entries.length > 0) ?? [],
      rewindOnUpdate: false,
    })
    playheadCtl.seek(props.defaultStep ?? 0)

    const laserParticles = computed(() => {
      return gameCtl.sim?.frames.flatMap((f) => f.particles) ?? []
    })

    const polBasis = computed(() => {
      return props.vector?.dimensions.find((d) => d.name === 'polarization')?.coordString ?? 'HV'
    })

    function updateRotation(coord: Coord) {
      gameCtl.rotateCcw(coord)
      const piece = gameCtl.level?.board.pieces.get(coord)
      if (piece) {
        emit('rotated', piece.rotation)
      }
    }

    return { gameCtl, playheadCtl, laserParticles, polBasis, updateRotation }
  },
})
</script>

<style lang="scss" scoped>
.container {
  display: inline-block;
  margin-bottom: 30px;

  .board {
    padding: 20px;
  }
}

.ket {
  width: 360px;
  padding: 5px 10px;
  margin-top: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
