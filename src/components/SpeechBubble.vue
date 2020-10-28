<template>
  <transition name="hint">
    <div
      v-if="shown"
      class="hint"
      :class="`hint--${hint.color}`"
      :style="positionStyle"
      @click="shouldHide"
    >
      <span>{{ hint.content }}</span>
      <div v-if="closeable" class="close">x</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { SpeechHint } from '@/engine/model'
import { computed, defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'SpeechBubble',
  props: {
    hint: { type: Object as PropType<SpeechHint>, required: true },
    tileSize: { type: Number, default: 64 },
    overridePosition: { type: Object as PropType<{ left: string; top: string }>, required: false },
    closeable: { type: Boolean, default: true },
  },
  setup(props) {
    const shown = ref(true)

    const positionStyle = computed(() => {
      if (props.overridePosition != null) {
        return props.overridePosition
      }
      const offset = props.hint.coord.gridCenter(props.tileSize)
      return {
        left: offset.x + 'px',
        top: offset.y + 'px',
      }
    })

    /**
     * Whether clicking onto the tooltip causes it to dissapear
     * depends on the context; disabled for overlays
     */
    function shouldHide(): void {
      if (props.closeable) {
        shown.value = false
      }
    }

    return {
      shown,
      positionStyle,
      shouldHide,
    }
  },
})
</script>

<style lang="scss" scoped>
.hint {
  padding: 2px 6px 6px 6px;
  transform: translate(-50%, -100%);
  z-index: 2;
  max-width: 500px;
  position: absolute;
  color: #fff;
  font-size: 12px;
  padding: 8px;
  @include media('>=medium') {
    font-size: 16px;
    padding: 12px 12px 12px 12px;
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
    @include media('>=medium') {
      right: 8px;
      top: 4px;
    }
  }
  &::after {
    content: ' ';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
  }
  &.hint--fuchsia {
    background-color: $fuchsia;
    &::after {
      border-color: $fuchsia transparent transparent transparent;
    }
  }

  &.hint--purple {
    background-color: $purple;
    &::after {
      border-color: $purple transparent transparent transparent;
    }
  }

  &.hint--orange {
    background-color: $orange;
    &::after {
      border-color: $orange transparent transparent transparent;
    }
  }
}

.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.3s;
}
.hint-enter,
.hint-leave-to {
  opacity: 0;
}
</style>
