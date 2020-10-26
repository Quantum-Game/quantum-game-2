<template>
  <transition name="bubble">
    <div v-if="coord" ref="root" :key="bubbleKey" class="bubble" :style="positionStyle">
      <div class="close" @click="$emit('close')">x</div>
      <div layout="column u2" class="params">
        <template v-for="param in pieceParams" :key="param.label">
          <label v-if="param.kind === ParamKind.Range" layout="row u1">
            <span>{{ param.label }}</span>
            <input v-model.number="param.ref.value" class="shortnum" />
            <input
              v-model.number="param.ref.value"
              flex
              type="range"
              :min="param.min"
              :max="param.max"
            />
          </label>
          <label v-if="param.kind === ParamKind.Boolean">
            <span>{{ param.label }}</span>
            <input v-model.number="param.ref.value" type="checkbox" />
          </label>
          <label v-if="param.kind === ParamKind.Choice">
            <span>{{ param.label }}</span>
            <select v-model.number="param.ref.value">
              <option v-for="(c, i) in param.choices" :key="c" :value="i">{{ c }}</option>
            </select>
          </label>
        </template>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { GameController } from '@/engine/controller'
import { elementAngles } from '@/engine/elements'
import { Coord, hasFlags, Piece, PieceFlags, rotationToDegrees, setFlags } from '@/engine/model'
import { useWindowEvent } from '@/mixins'
import { IStyle } from '@/types'
import { computed, defineComponent, PropType, ref, WritableComputedRef } from 'vue'

enum ParamKind {
  Range,
  Boolean,
  Choice,
}

interface ParamRange {
  kind: ParamKind.Range
  label: string
  min: number
  max: number
  ref: WritableComputedRef<number>
}

interface ParamBoolean {
  kind: ParamKind.Boolean
  label: string
  ref: WritableComputedRef<boolean>
}

interface ParamChoice {
  kind: ParamKind.Choice
  label: string
  choices: string[]
  ref: WritableComputedRef<number>
}

type Param = ParamRange | ParamBoolean | ParamChoice

export default defineComponent({
  name: 'SpeechBubble',
  props: {
    tileSize: { type: Number, default: 64 },
    gameCtl: { type: Object as PropType<GameController>, required: true },
    coord: { type: Object as PropType<Coord>, required: false },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const root = ref<HTMLElement>()
    const positionStyle = computed(
      (): IStyle => {
        if (props.coord == null) return {}
        const offset = props.coord.gridCenter(props.tileSize)
        return {
          left: offset.x + 'px',
          top: offset.y - props.tileSize * 0.5 + 'px',
        }
      }
    )

    useWindowEvent('mousedown', (e) => {
      if (root.value != null && e.target != null) {
        if (!root.value.contains(e.target as Node)) {
          e.preventDefault()
          e.stopPropagation()
          emit('close')
        }
      }
    })

    useWindowEvent('keydown', (e) => {
      if (e.key === 'Escape' && root.value != null) {
        e.stopPropagation()
        e.preventDefault()
        emit('close')
      }
    })

    const piece = computed(() => {
      if (props.coord == null) return null
      return props.gameCtl.level?.board.pieces.get(props.coord) ?? null
    })

    function updatePiece<P extends Piece>(p: P, data: Partial<P>) {
      if (piece.value === p && props.coord != null) {
        const newPiece: P = { ...p, ...data }
        props.gameCtl.setPiece(props.coord, newPiece)
      } else {
        console.error(`Trying to update non-current piece`)
      }
    }

    const bubbleKey = computed(() => {
      return piece.value == null ? null : props.coord
    })

    function setNum(val: number, div: number): number {
      if (Number.isNaN(val)) {
        return 0
      }
      return Math.round(val) / div
    }

    const pieceParams = computed((): Param[] => {
      const p = piece.value
      if (p == null) return []
      const params: Param[] = [
        {
          kind: ParamKind.Boolean,
          label: 'Draggable',
          ref: computed({
            get: () => hasFlags(p.flags, PieceFlags.Draggable),
            set: (v: boolean) =>
              updatePiece(p, { flags: setFlags(p.flags, PieceFlags.Draggable, v) }),
          }),
        },
      ]
      if (elementAngles(p.type).length > 1) {
        params.push({
          kind: ParamKind.Boolean,
          label: 'Rotateable',
          ref: computed({
            get: () => hasFlags(p.flags, PieceFlags.Rotateable),
            set: (v: boolean) =>
              updatePiece(p, { flags: setFlags(p.flags, PieceFlags.Rotateable, v) }),
          }),
        })
      }

      if ('rotation' in p) {
        let angles = elementAngles(p.type)
        params.push({
          kind: ParamKind.Choice,
          label: 'Rotation',
          choices: angles.map((r) => `${rotationToDegrees(r)}°`),
          ref: computed({
            get: () => angles.indexOf(p.rotation),
            set: (idx) => updatePiece(p, { rotation: angles[idx] }),
          }),
        })
      }

      if ('polarization' in p) {
        params.push({
          kind: ParamKind.Range,
          label: 'Polarization',
          min: 0,
          max: 360,
          ref: computed({
            get: () => Math.round(p.polarization * 360),
            set: (v) => updatePiece(p, { polarization: setNum(v, 360) }),
          }),
        })
      }

      if ('goalThreshold' in p) {
        params.push({
          kind: ParamKind.Range,
          label: 'Polarization',
          min: 0,
          max: 100,
          ref: computed({
            get: () => Math.round(p.goalThreshold * 100),
            set: (v) => updatePiece(p, { goalThreshold: setNum(v, 100) }),
          }),
        })
      }

      if ('absorption' in p) {
        params.push({
          kind: ParamKind.Range,
          label: 'Absorption',
          min: 0,
          max: 100,
          ref: computed({
            get: () => Math.round(p.absorption * 100),
            set: (v) => updatePiece(p, { absorption: setNum(v, 100) }),
          }),
        })
      }

      if ('polarizationRotation' in p) {
        params.push({
          kind: ParamKind.Range,
          label: 'Polarization rotation',
          min: 0,
          max: 360,
          ref: computed({
            get: () => Math.round(p.polarizationRotation * 360),
            set: (v) => updatePiece(p, { polarizationRotation: setNum(v, 360) }),
          }),
        })
      }

      if ('split' in p) {
        params.push({
          kind: ParamKind.Range,
          label: 'Split',
          min: 0,
          max: 100,
          ref: computed({
            get: () => Math.round(p.split * 100),
            set: (v) => updatePiece(p, { split: setNum(v, 100) }),
          }),
        })
      }

      return params
    })

    return {
      root,
      bubbleKey,
      positionStyle,
      piece,
      pieceParams,
      ParamKind,
    }
  },
})
</script>

<style lang="scss" scoped>
.bubble {
  padding: 2px 6px 6px 6px;
  transform: translate(-50%, -100%);
  background-color: $purple;
  z-index: 2;
  max-width: 500px;
  position: absolute;
  color: #fff;
  font-size: 12px;
  padding: 8px;

  &::after {
    content: ' ';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color: $purple transparent transparent transparent;
  }
  & .close {
    user-select: none;
    position: absolute;
    right: 4px;
    top: 2px;
    text-align: right;
    font-size: 10px;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.5);
  }
}

.params span {
  display: inline-block;
  width: 100px;
}

.shortnum {
  width: 50px;
}

.bubble-enter-active,
.bubble-leave-active {
  transition: opacity 0.5s ease-out;
}
.bubble-enter,
.bubble-leave-to {
  opacity: 0;
}
</style>
