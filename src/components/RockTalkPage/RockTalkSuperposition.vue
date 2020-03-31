<template>
  <div>
    <div class="rock-text">
      <p>We didn't split a photon. It is still one photon in many places at the same time. How is it possible?! Read more about <a href="https://quantumgame.io/info/superposition">SUPERPOSITION</a> in the game encyclopedia.</p>
    </div>
    <img src="@/assets/graphics/overlays/rock_talk_line.svg" alt="rock-line" />
    <div class="happy-rock">
      <img src="@/assets/graphics/overlays/rock_happy.svg" alt="rock-happy" />
    </div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class RockTalkSuperposition extends Vue {}
</script>

<style>
h1 {
  text-transform: uppercase;
  font-size: 2rem;
}
a {
  font-size: 1rem;
  text-transform: uppercase;
  text-align: center;
}
.rock-text {
  margin-bottom: 2rem;
  /* border-top: 1px solid white; */
}
.happy-rock {
  /* width: 70%; */
  margin: 0px 5rem 2rem 5rem;
  min-width: 100px;
}
.rockhappyst0 {
  clip-path: url(#SVGID_2_);
}
.rockhappyst1 {
  fill: #615777;
}
.rockhappyst2 {
  fill: #2f2549;
}
.rockhappyst3 {
  fill: #120223;
}
.rockhappyst4 {
  fill: #ffffff;
}
.rockhappyst5 {
  fill: #5c00d3;
}
.rockhappyst6 {
  opacity: 0.35;
  fill: #ffffff;
}
</style>
