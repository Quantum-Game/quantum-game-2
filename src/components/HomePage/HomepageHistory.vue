<template>
  <div class="history" layout="column center">
    <p>
      Previous funding include
      <a href="https://www.quantumlah.org/" target="_blank">Center for Quantum Technologies</a>
      of the National University of Singapore. Read a CQT post on the game:
      <a
        href="https://www.quantumlah.org/about/highlight/2020-04-play-new-quantum-game"
        target="_blank"
        >Ready to play the Quantum Game with Photons 2?</a
      >
    </p>
    <img src="@/assets/graphics/CQT_NUS_Logo_mono.svg" alt="CQT logo" class="CQTlogo" />
    <p>
      You can play the old version (2014-2016)
      <a href="http://play.quantumgame.io/" target="_blank">here</a>.
    </p>
  </div>
</template>

<style lang="scss" scoped>
a {
  color: #eab5ff;
  text-decoration: none;
}
a:hover {
  color: white;
}
.history {
  border-top: 2px solid white;
  padding-top: 30px;
  line-height: 1.5;
}
.CQTlogo {
  width: 40%;
  padding-bottom: 10px;
  min-width: 250px;
}
</style>
