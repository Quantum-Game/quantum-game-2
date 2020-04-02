<template>
  <div>
    <div class="rock-text">
      <p>
        Crazy, isn't it? Lear more about
        <a href="https://quantumgame.io/info/interference">INTERFERENCE</a> in the game
        encyclopedia.
      </p>
    </div>
    <img src="@/assets/graphics/overlays/rock_talk_line.svg" alt="rock-line" />
    <div class="happy-rock">
      <img src="@/assets/graphics/rock_weasel.svg" alt="rock-weasel" />
    </div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class RockTalkIntereference extends Vue {}
</script>

<style>
h1 {
  text-transform: uppercase;
  font-size: 2rem;
}
p {
  font-size: 1rem;
  text-align: center;
  line-height: 1.5;
}
a {
  font-size: 1rem;
  text-transform: uppercase;
  line-height: 1.5;
  font-weight: 900;
}
.rock-text {
  margin-bottom: 2rem;
  font-size: 1rem;
}
.happy-rock {
  margin: 0px 5rem 2rem 5rem;
  height: 100%;
  min-height: 100px;
  width: 30vw;
  max-width: 500px;
}
</style>
