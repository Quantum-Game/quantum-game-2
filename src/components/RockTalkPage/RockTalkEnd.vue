<template>
  <div>
    <div class="rock-text">
      <p>That's it for now!</p>
      <p>Write to us on <a href="https://twitter.com/quantumgameio">Twitter</a>.</p>
    </div>
    <img class="rock-line" src="@/assets/graphics/overlays/rock_talk_line.svg" alt="rock-line" />
    <div class="happy-rock">
      <img src="@/assets/graphics/overlays/pile.svg" alt="rock-happy" />
    </div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class RockTalkEnd extends Vue {}
</script>

<style scoped>
p {
  font-size: 1.2rem;
  line-height: 1;
}
a {
  font-size: 1.2rem;
  text-align: center;
}
.rock-text {
  margin-bottom: 2rem;
  /* border-top: 1px solid white; */
}
.rock-line {
  width: 50%;
}
.happy-rock {
  /* width: 70%; */
  margin: 0px 5rem 2rem 5rem;
  min-width: 100px;
  height: 50px;
}
</style>
