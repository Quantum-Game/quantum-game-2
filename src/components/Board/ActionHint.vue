<template>
  <g v-if="cellComponent != null" :style="cellStyle">
    <g :class="hintClass">
      <component :is="cellComponent" />
    </g>
  </g>
</template>

<script lang="ts">
import { elementComponents } from './Cell/index'
import { computed, defineComponent, PropType } from 'vue'
import { HintActionType, Coord, rotationToDegrees } from '@/engine/model'
import { IStyle } from '@/types'
import { ActionHighlight } from '@/engine/controller'

export default defineComponent({
  props: {
    hint: { type: Object as PropType<ActionHighlight>, required: true },
  },
  setup(props) {
    const cellStyle = computed(
      (): IStyle => {
        const rotation = rotationToDegrees(props.hint.rotation)
        const coord = props.hint.coord ?? Coord.new(0, 0)
        const origin = coord.gridCenter()
        const translate = coord.gridTopLeft()

        return {
          transformOrigin: `${origin.x}px ${origin.y}px`,
          transform: `rotate(-${rotation}deg) translate(${translate.x}px, ${translate.y}px)`,
        }
      }
    )

    const hintClass = computed(() => {
      return {
        hintOverlay: true,
        hintRotation: props.hint.action === HintActionType.Rotation,
        hintDrag: props.hint.action === HintActionType.Drag,
        hintPulse: props.hint.action === HintActionType.Pulse,
      }
    })

    const cellComponent = computed(() => {
      return elementComponents[props.hint.elem]
    })

    return {
      cellComponent,
      cellStyle,
      hintClass,
    }
  },
})
</script>

<style lang="scss" scoped>
.hintOverlay::v-deep {
  pointer-events: none;
  transform-origin: 32px 32px;
  opacity: 0;
  [fill] {
    fill: white;
  }
  [stroke] {
    stroke: white;
  }
}

.hintRotation {
  animation: hintRotation 5s 0.5s ease-in-out infinite;
}

.hintDrag {
  animation: hintDrag 5s 0.5s ease-in-out infinite;
}

.hintPulse {
  animation: hintPulse 2s 0.5s ease-in-out infinite;
}

@keyframes hintRotation {
  0% {
    opacity: 0;
  }
  6% {
    opacity: 0.5;
    transform: rotate(3deg);
  }
  8% {
    transform: rotate(-6deg);
  }
  10% {
    transform: rotate(6deg);
  }
  12% {
    transform: rotate(-4deg);
  }
  14% {
    opacity: 0.5;
    transform: rotate(0deg);
  }
  20% {
    opacity: 0;
  }
}

@keyframes hintDrag {
  0% {
    opacity: 0;
  }
  4% {
    opacity: 0.5;
    transform: translate(2px, 0px);
  }
  8% {
    transform: translate(-3px, 0px);
  }
  10% {
    transform: translate(3px, 0px);
  }
  12% {
    transform: translate(-2px, 0px);
  }
  14% {
    opacity: 0.5;
    transform: translate(0px, 0px);
  }
  20% {
    opacity: 0;
  }
}

@keyframes hintPulse {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0.8;
  }

  80% {
    opacity: 0;
  }
}
</style>
