<template>
  <div>
    <h1>WHAT UP, You're in level number {{stateLevelNumber}}</h1>
    <button @click="goBack"> no </button>
    <button @click="goOn"> yes </button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component
export default class Level extends Vue {
  mounted() {
    if (this.queryAndStoreLevelNumbersAreNotTheSame) {
      console.log('They do not match!');
      this.$store.dispatch('goToLevel', this.queryLevelNumber);
    }
  }

  goOn() {
    this.$store.dispatch('goToLevel', 'next');
  }

  goBack() {
    this.$store.dispatch('goToLevel', 'back');
  }

  get stateLevelNumber() {
    return this.$store.state.progress.currentLevel.number;
  }

  get queryLevelNumber() {
    return parseInt(this.$route.params.id, 10);
  }

  get queryAndStoreLevelNumbersAreNotTheSame() {
    return this.stateLevelNumber !== this.queryLevelNumber;
  }

  @Watch('stateLevelNumber')
  syncPathAndLevel(val, oldVal) {
    if (this.queryAndStoreLevelNumbersAreNotTheSame) {
      this.$router.push(`${val}`);
      console.log('should be synced!')
    }
  }
}
</script>

<style>

</style>