<template>
  <div class="home-page-wrapper">
    <div class="row-full">
      <img src="@/assets/graphics/QG_logo.svg" alt="QuantumGame" />
    </div>
    <div class="gameVersion">
      <p>
        Version {{ version }} (beta), based on a
        <a :href="commitPath" target="_blank">{{ commitDate }}</a> commit.<br />
        For optimal experience, play PC (mobile version coming soon).
      </p>
    </div>
    <router-link to="/level/1">
      <app-button type="big">PLAY</app-button>
    </router-link>
    <div class="hello">
      <h1>
        A puzzle game with photons, superposition and quantum measurement, right in your browser.
        With true quantum mechanics underneath!
        <br />
      </h1>
      <p>
        Visit us on
        <a href="https://twitter.com/quantumgameio" target="_blank">Twitter</a>,
        <a href="https://www.facebook.com/quantumgameio/" target="_blank">Facebook</a>,
        <a href="https://github.com/Quantum-Game" target="_blank">GitHub</a>, and
        <a href="https://medium.com/quantum-photons" target="_blank">Medium</a>. If you have any
        comments, @ us at Twitter, create a GitHub Issue or simply
        <a href="mailto:pmigdal+qg@gmail.com">email us</a>! :)
      </p>
      <p>
        Quantum Game is currently being developed by
        <a href="https://p.migdal.pl/" target="_blank">Piotr Migdał</a>,
        <a href="https://fr.linkedin.com/in/philippe-cochin-b4978231" target="_blank"
          >Philippe Cochin</a
        >, <a href="https://maperseguirvirtute.wordpress.com/" target="_blank">Chiara Decaroli</a>,
        <a href="http://jankiewiczstudio.com/" target="_blank">Klem Jankiewicz</a>,
        <a href="https://www.linkedin.com/in/strebeyko/" target="_blank">Kuba Strebeyko</a>.
        Generative soundtrack by
        <a href="https://www.paweljanicki.jp/" target="_blank">Pawel Janicki</a>.
      </p>
      <p>
        This version of the game was funded by the
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
      <div class="image">
        <img src="@/assets/graphics/Rock.svg" alt="Rock" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AppButton from '@/components/AppButton.vue'

console.log('env', process.env)

@Component({
  components: {
    AppButton,
  },
})
export default class HomePage extends Vue {
  version: string = process.env.VUE_APP_VERSION
  commitHash: string = process.env.VUE_APP_GIT_HASH

  get commitDate(): string {
    const date = new Date(process.env.VUE_APP_GIT_DATE * 1000)
    return date.toUTCString()
  }

  get commitPath(): string {
    return `https://github.com/Quantum-Game/quantum-game-2/commit/${this.commitHash}`
  }
}
</script>

<style lang="scss" scoped>
.home-page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(#5c00d3, #ff0055, #fbb03b);
  width: 100%;
  & a {
    width: 100%;
    & img {
      max-width: 250px;
    }
  }
}
.gameVersion {
  font-size: 0.8rem;
  @media screen and (max-width: 1000px) {
    font-size: 1rem;
    width: 80%;
  }
}
h1 {
  color: white;
  font-size: 1.4rem;
  font-weight: normal;
  line-height: 150%;
}
p {
  color: white;
  line-height: 150%;
}
.hello {
  width: 35%;
  display: flex;
  position: center;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 1259px) {
    width: 60%;
  }
  @media screen and (max-width: 560px) {
    width: 80%;
  }
}
.row-full {
  width: 100vw;
  min-width: 1300px;
  position: center;
  height: 100px;
  margin-bottom: 8rem;
  align-items: center;
  @media screen and (max-width: 1000px) {
    margin-bottom: 6rem;
  }
}
.CQTlogo {
  width: 40%;
  padding-bottom: 10px;
  min-width: 250px;
}

a {
  color: rgb(255, 181, 209);
  text-decoration: none;
}
a:hover {
  color: white;
}

* {
  transition: all 0.6s;
}

::placeholder {
  color: white;
  font-family: Montserrat, Arial, Helvetica, sans-serif;
}
</style>
