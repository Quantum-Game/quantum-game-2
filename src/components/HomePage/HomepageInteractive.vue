<template>
  <div class="interactive">
    <p>
      <a href="https://quantumgame.io/info/mach-zehnder-interferometer" target="_blank"
        >Mach-Zehnder Interferometer</a
      >
      - a virtual optical table
    </p>
    <p>
      <a href="https://quantumgame.io/info/beam-splitter" target="_blank">Faraday rotator</a> - an
      explorable explanation
    </p>
    <p>
      <a href="https://github.com/Quantum-Game/bra-ket-vue" target="_blank">⟨𝜑|𝜓⟩.vue</a> -
      visualizer for quantum states and matrices
    </p>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class HomepageInteractive extends Vue {}
</script>

<style lang="scss" scoped>
a {
  color: rgb(255, 181, 209);
  text-decoration: none;
}
a:hover {
  color: white;
}
</style>
