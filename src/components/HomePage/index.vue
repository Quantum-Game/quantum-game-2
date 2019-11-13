<template>
  <div class="home-page-wrapper">
    <div class="row-full">
      <img src="@/assets/QG_logo.svg" alt="QuantumGame" />
    </div>
    <router-link to="/level/1">
      <app-button type="big">PLAY</app-button>
    </router-link>
    <br />
    <div class="hello">
      <h1>
        A puzzle game with photons, superposition and quantum measurement, right in your browser.
        With true quantum mechanics underneath!
        <br />
      </h1>
      <h1>
        Visit us on
        <a href="https://twitter.com/quantumgameio" target="_blank">Twitter</a>,
        <a href="https://www.facebook.com/quantumgameio/" target="_blank">Facebook</a>,
        <a href="https://github.com/stared/quantum-game-2" target="_blank">Github</a> and
        <a href="https://medium.com/quantum-photons" target="_blank">Medium</a>.
      </h1>
      <p>
        Quantum Game is currently being developed by dr
        <a href="https://p.migdal.pl/" target="_blank">Piotr Migdał</a>,
        <a href="https://fr.linkedin.com/in/philippe-cochin-b4978231" target="_blank"
          >Philippe Cochin</a
        >, <a href="https://maperseguirvirtute.wordpress.com/" target="_blank">Chiara Decaroli</a>,
        <a href="http://jankiewiczstudio.com/" target="_blank">Klem Jankiewicz</a>,
        <a href="https://www.linkedin.com/in/strebeyko/" target="_blank">Kuba Strebeyko</a>.
      </p>
      <p>
        This version of the game was funded by the
        <a href="https://www.quantumlah.org/" target="_blank">Center for Quantum Technologies</a>
        of the National University of Singapore.
      </p>
      <img src="@/assets/CQT_NUS_Logo_mono.svg" alt="CQT logo" class="CQTlogo" />
      <p>
        You can play the old version
        <a href="http://play.quantumgame.io/" target="_blank">here</a>.
      </p>
      <div class="image">
        <img src="@/assets/Rock.svg" alt="Rock" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AppButton from '@/components/AppButton.vue';

@Component({
  components: {
    AppButton
  }
})
export default class HomePage extends Vue {}
</script>

<style lang="scss" scoped>
.home-page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(#5c00d3, #ff0055, #fbb03b);
  width: 100%;
  h2 {
    color: white;
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 150%;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
  & a {
    width: 100%;
    & img {
      max-width: 250px;
    }
  }
}
h1 {
  color: white;
  font-size: 1.4rem;
  font-weight: normal;
  line-height: 150%;
}
h2 {
  margin-top: 20px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  line-height: 150%;
  text-transform: uppercase;
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
    width: 100%;
  }
}
.row-full {
  width: 100vw;
  min-width: 1300px;
  position: center;
  height: 100px;
  margin-top: 100px;
  margin-bottom: 12vw;
  align-items: center;
}
.image {
  width: 30%;
  padding-bottom: 10px;
  min-width: 200px;
}
.blog {
  border-top: 1px solid white;
  color: white;
  font-size: 1rem;
  font-weight: normal;
  line-height: 150%;
}

h3 {
  color: white;
  text-align: left;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
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

input[type='email'] {
  outline: none;
  display: inline-block;
  width: 60%;
  padding: 10px;
  background: none;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid white;
  box-sizing: border-box;
  color: white;
  font-size: 1rem;
  font-weight: normal;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  margin-right: 20px;
}

input[type='email']:focus {
  color: white;
  font-family: Montserrat, Arial, Helvetica, sans-serif;
  font-size: 1rem;
  font-weight: normal;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid white;
}

::placeholder {
  color: white;
  font-family: Montserrat, Arial, Helvetica, sans-serif;
}

@media screen and (max-width: 736px) {
  input[type='email'] {
    color: white;
    font-size: 1rem;
    font-weight: normal;
    display: block;
    width: 100%;
  }
}
</style>
