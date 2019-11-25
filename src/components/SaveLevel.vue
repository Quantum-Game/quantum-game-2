<template>
  <div>
    <img class="saveIcon" :class="{ inactive: !isLoggedIn}" @click="handleClick" src="@/assets/save.svg" />

    <app-button
      class="saveButton"
      :class="{ inactive: !isLoggedIn}"
      type="special inline"
      @click.native="handleClick"
    >
      Save Level
    </app-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import $userStore from '@/store/userStore';
import AppButton from '@/components/AppButton.vue';

@Component({
  components: {
    AppButton
  }
})
export default class SaveLevel extends Vue {
  get isLoggedIn() {
    return $userStore.getters.isLoggedIn;
  }

  saveLevel() {
    $userStore.dispatch('SAVE_LEVEL', this.$store.state);
  }
  updateLevel() {
    $userStore.dispatch('UPDATE_LEVEL', this.$store.state);
  }

  handleClick() {
    console.log('boop');
    if (!this.$route.meta.levelSaved) {
      this.saveLevel();
    } else {
      this.updateLevel();
    }
  }
}
</script>

<style lang="scss">
.saveIcon {
  display: none !important;
  @media screen and (max-width: 1000px) {
    display: inline !important;
    width: 4.5vw;
    height: 4.5vw;
  }
}
.saveButton {
  @media screen and (max-width: 1000px) {
    display: none !important;    
  }
}
</style>