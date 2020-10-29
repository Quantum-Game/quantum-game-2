<template>
  <transition name="victory">
    <div v-if="victory" class="wrapper victory" @click="$emit('bg-click')">
      <div class="victory-circle" @click.stop>
        <h2>You won!</h2>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Confetti } from 'vue-confetti'
import { defineComponent, onUnmounted, watch } from 'vue'

const confettiConfig = {
  particlesPerFrame: 3,
  defaultSize: 8,
  particles: [
    {
      dropRate: 15,
    },
  ],
  defaultColors: [
    '#ffbb3b', // Q yellow
    '#5c00d3', // Q purple
    '#ff0055', // Q red
    '#ff8b00', // orange 01
    '#ff5d15', // orange 02
    '#ba00ff', // purple 02
    '#ffbb3b', // Q yellow
    '#5c00d3', // Q purple
    '#ff0055', // Q red
    '#ff8b00', // orange 01
    '#ff5d15', // orange 02
    '#ba00ff', // purple 02
  ],
}

export default defineComponent({
  props: {
    victory: { type: Boolean, required: true },
  },
  emits: {
    'bg-click': null,
  },
  setup(props) {
    const confetti = new Confetti()
    onUnmounted(() => confetti.stop())

    watch(
      () => props.victory,
      (victory) => {
        if (victory) {
          confetti.start(confettiConfig)
        } else {
          confetti.stop()
        }
      }
    )
  },
})
</script>

<style lang="scss" scoped>
.victory-enter-active,
.victory-leave-active {
  transition: opacity 0.5s;
}
.victory-enter,
.victory-leave-to {
  opacity: 0;
}

.victory.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  & .victory-circle {
    width: 300px;
    height: 300px;
    border-radius: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 10px;
    background: linear-gradient(#5c00d3, #ff0055, #fbb03b);
  }
  h2 {
    color: white;
    font-size: 2rem;
    margin: 10px;
  }
}

.wrapper {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 3;
  display: flex;
  align-items: center;
}
</style>
