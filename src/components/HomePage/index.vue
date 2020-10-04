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
    <div>
      <router-link to="/level/1">
        <app-button class="button" type="big">PLAY GAME</app-button>
      </router-link>
      <router-link to="/sandbox">
        <app-button class="button" type="big">VIRTUAL LAB</app-button>
      </router-link>
    </div>
    <div class="hello">
      <h1>{{ i18n.t('homepage.main') }}</h1>
      <p>{{ i18n.t('homepage.desc') }}</p>
      <homepage-interactive />
      <homepage-testimonials />
      <homepage-social />
      <homepage-authors />
      <homepage-history />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, setup } from 'vue-class-component'
import AppButton from '@/components/AppButton.vue'
import HomepageAuthors from '@/components/HomePage/HomepageAuthors.vue'
import HomepageSocial from '@/components/HomePage/HomepageSocial.vue'
import HomepageTestimonials from '@/components/HomePage/HomepageTestimonials.vue'
import HomepageInteractive from '@/components/HomePage/HomepageInteractive.vue'
import HomepageHistory from '@/components/HomePage/HomepageHistory.vue'
import { useI18n } from 'vue-i18n'

@Options({
  components: {
    AppButton,
    HomepageAuthors,
    HomepageSocial,
    HomepageHistory,
    HomepageTestimonials,
    HomepageInteractive,
  },
})
export default class HomePage extends Vue {
  version: string = process.env.VUE_APP_VERSION || 'unknown'
  commitHash: string = process.env.VUE_APP_GIT_HASH || 'unknown'
  i18n = setup(useI18n)

  get commitDate(): string {
    const date = new Date(+(process.env.VUE_APP_GIT_DATE || 0) * 1000)
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
  background: linear-gradient(to right, #210235 16%, #2e006a 30%, #2e006a 70%, #210235 84%);
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
  @include media('<large') {
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
.button {
  margin-left: 10px !important;
  margin-right: 10px !important;
}

.row-full {
  width: 100vw;
  min-width: 1300px;
  position: center;
  height: 100px;
  margin-bottom: 8rem;
  align-items: center;
  @include media('<large') {
    margin-bottom: 6rem;
  }
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
