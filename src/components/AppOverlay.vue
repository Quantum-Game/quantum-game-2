<template>
  <transition :name="state">
    <div v-if="victory" :class="`wrapper ${state}`">
      <div class="victory-circle">
        <h2>
          You won!
        </h2>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Confetti } from 'vue-confetti'
import { computed, defineComponent, onUnmounted, watch } from 'vue'

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
    state: { type: String, required: false },
  },
  setup(props) {
    const confetti = new Confetti()
    onUnmounted(() => confetti.stop())

    const victory = computed(() => props.state === 'Victory')
    watch(victory, (victory) => {
      if (victory) {
        confetti.start(confettiConfig)
      } else {
        confetti.stop()
      }
    })

    return { victory }
  },
})
</script>

<style lang="scss" scoped>
.Victory-enter-active,
.Victory-leave-active {
  transition: opacity 0.5s;
}
.Victory-enter,
.Victory-leave-to {
  opacity: 0;
}

.Victory.wrapper {
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

.MineExploded-enter,
.MineExploded-leave-to {
  opacity: 0;
}

.MineExploded.wrapper {
  opacity: 0.8;
  background: #ff0055;
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
