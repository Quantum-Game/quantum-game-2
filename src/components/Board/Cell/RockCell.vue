<template>
  <svg ref="root" :class="state" :style="rockStyle">
    <path
      stroke="#F0F"
      stroke-width="2"
      d="M10.15 55.324L2.697 42.645a3.084 3.084 0 01-.605-2.695l6.043-20.765C10.05 12.595 16.092 10 23.042 10l14.503.899c1.712 0 3.223.698 4.532 1.697l14.604 11.98a6.79 6.79 0 012.518 4.093l3.324 14.775c0 .699 0 1.298-.302 1.997l-3.928 9.484c-.504.998-1.612 1.697-2.82 1.697H12.768c-1.007 0-2.014-.4-2.618-1.298z"
      class="rock-mask"
    />
    <path
      fill="#44375E"
      d="M10.15 55.324L2.697 42.645a3.084 3.084 0 01-.605-2.695l6.043-20.765C10.05 12.595 16.092 10 23.042 10l14.503.899c1.712 0 3.223.698 4.532 1.697l14.604 11.98a6.79 6.79 0 012.518 4.093l3.324 14.775c0 .699 0 1.298-.302 1.997l-3.928 9.484c-.504.998-1.612 1.697-2.82 1.697H12.768c-1.007 0-2.014-.4-2.618-1.298z"
      class="base"
    />
    <path
      fill="#615777"
      d="M43.108 13.441c-6.835-.705-19.915-1.6-23.003.87-4.443 3.4-7.701 23.867-7.701 25.803 0 1.466 2.666 11.142 3.85 14.367h-6.6L2.697 42.645a3.084 3.084 0 01-.605-2.695l6.043-20.765C10.05 12.595 16.092 10 23.042 10l14.503.899c1.712 0 3.223.698 4.532 1.697l1.03.845z"
      class="light"
    />
    <path
      fill="#2F2549"
      d="M43.256 13.563l13.425 11.013a6.79 6.79 0 012.518 4.093l3.324 14.775c0 .699 0 1.298-.302 1.997l-3.928 9.484c-.504.998-1.612 1.697-2.82 1.697h-.13l-27.623-2.14s17.478-2.141 21.139-2.64c5.019-.88 6.79-3.811 6.495-6.45 0-2.053 0-7.038-2.067-9.09-1.346-1.319-3.332-1.541-5.966-1.837-1.408-.158-3-.336-4.78-.714-5.02-1.173-7.381-11.143-6.2-13.195.435-1.08 4.23-4.543 6.791-6.88l.124-.113z"
      class="dark"
    />
    <path
      fill="#120223"
      d="M9.654 54.481l.496.843c.604.898 1.611 1.298 2.618 1.298h42.705c1.208 0 2.316-.699 2.82-1.697l.183-.444H9.654z"
      class="shadow"
    />
    <g class="eyes">
      <path
        fill="#fff"
        d="M26.096 29.265c0 3.643-2.974 6.597-6.642 6.597-3.67 0-6.643-2.954-6.643-6.598 0-3.643 2.974-6.597 6.643-6.597 3.668 0 6.642 2.954 6.642 6.598zm18.895 0c0 3.643-2.974 6.597-6.642 6.597-3.67 0-6.643-2.954-6.643-6.598 0-3.643 2.974-6.597 6.643-6.597 3.668 0 6.642 2.954 6.642 6.598z"
        class="white"
      />
      <path
        fill="#120223"
        d="M22.79 29.265c0 1.83-1.494 3.313-3.336 3.313-1.843 0-3.337-1.484-3.337-3.314s1.494-3.313 3.337-3.313c1.842 0 3.336 1.484 3.336 3.314zm18.895 0c0 1.83-1.494 3.313-3.336 3.313-1.843 0-3.336-1.484-3.336-3.314s1.493-3.313 3.336-3.313c1.842 0 3.336 1.484 3.336 3.314z"
        class="iris"
      />
      <path
        fill="#5C00D3"
        d="M20.753 29.265c0 .712-.582 1.29-1.3 1.29a1.295 1.295 0 01-1.298-1.29c0-.713.581-1.29 1.299-1.29.717 0 1.299.577 1.299 1.29zm18.895 0c0 .712-.582 1.29-1.3 1.29-.717 0-1.298-.578-1.298-1.29 0-.713.581-1.29 1.299-1.29.717 0 1.299.577 1.299 1.29z"
        class="pupil"
      />
      <g class="eyelids">
        <mask
          :id="`eyelid-mask-${uid}`"
          width="34"
          height="15"
          x="12"
          y="14"
          class="mask0"
          maskUnits="userSpaceOnUse"
        >
          <path fill="#fff" d="M12.629 14.985h32.475v13.781H12.63V14.985z" class="eyelid-mask" />
        </mask>
        <g :mask="`url(#eyelid-mask-${uid})`">
          <path
            fill="#615777"
            d="M26.21 29.352c0 3.725-3.04 6.744-6.791 6.744-3.75 0-6.79-3.019-6.79-6.743 0-3.725 3.04-6.745 6.79-6.745s6.79 3.02 6.79 6.744zm18.894 0c0 3.725-3.04 6.744-6.79 6.744s-6.79-3.019-6.79-6.743c0-3.725 3.04-6.745 6.79-6.745s6.79 3.02 6.79 6.744z"
            class="eyelids_2"
            clip-rule="evenodd"
          />
        </g>
      </g>
    </g>
    <path
      fill="#fff"
      fill-opacity=".349"
      d="M11.925 19.06c-.089 0-.177-.029-.295-.058a.743.743 0 01-.414-.997c.09-.235 2.274-5.483 7.736-6.568a.774.774 0 01.915.586.768.768 0 01-.59.91c-4.665.938-6.584 5.6-6.614 5.629-.147.322-.413.498-.738.498z"
      class="highlight"
    />
  </svg>
</template>

<script lang="ts">
import { useMouseCoords, useTimer } from '@/mixins'
import { computed, defineComponent, reactive, ref } from 'vue'
import { props } from './Piece'
let uid = 0
export default defineComponent({
  props,
  setup(props) {
    const mouse = useMouseCoords()
    const root = ref<HTMLElement>()

    const restEyePos = reactive({ x: 0, y: 0 })

    const eyeMovement = useTimer(moveEyesRandom)

    function moveEyesRandom() {
      restEyePos.x = Math.random() - 0.5
      restEyePos.y = Math.random() - 0.5
      if (Math.random() > 0.5) {
        eyeMovement.restart(300 + Math.random() * 1000, moveEyesCenter)
      } else {
        eyeMovement.restart(300 + Math.random() * 500, moveEyesRandom)
      }
    }

    function moveEyesCenter() {
      restEyePos.x = 0
      restEyePos.y = 0
      eyeMovement.restart(3000 + Math.random() * 2000, moveEyesRandom)
    }

    moveEyesCenter()

    const eyePos = computed(() => {
      // prevent too much activity on mouse move, only respond to mouse when hovered
      if (props.state?.hover && root.value != null) {
        const bounds = root.value.getBoundingClientRect()
        const x = (mouse.clientX - bounds.x) / bounds.width - 0.5
        const y = (mouse.clientY - bounds.y) / bounds.height - 0.4
        return { x, y }
      } else {
        return restEyePos
      }
    })

    return {
      rockStyle: computed(() => {
        const { x, y } = eyePos.value
        return `--eye-x: ${x}; --eye-y: ${y};`
      }),
      root,
      uid: uid++,
    }
  },
})
</script>

<style lang="scss" scoped>
.eyelid-mask {
  transform: translateY(calc(var(--eye-y) * 8px - 1px));
  transition: transform 0.3s;
}

.pupil,
.iris {
  transform: translate(0px, 0px);
  transition: transform 0.5s ease;
}

.pupil {
  transform: translate(calc(var(--eye-x) * 4.8px), calc(var(--eye-y) * 4.8px));
}
.iris {
  transform: translate(calc(var(--eye-x) * 3.8px), calc(var(--eye-y) * 3.8px));
}

svg.hover {
  .eyelid-mask {
    transition: transform 0s;
  }
  .pupil,
  .iris {
    transition: transform 0s;
  }
}

svg.interacting,
svg.energized {
  .eyelid-mask {
    transform: translateY(-6px);
    transition: transform 0.2s;
  }
}

// svg.energized {
//   .light {
//     fill: #ff507e;
//   }
//   .base {
//     fill: #ff0055;
//   }
//   .dark {
//     fill: #8c0033;
//   }
//   .pupil {
//     fill: #d30041;
//   }
// }
</style>
