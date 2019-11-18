<template>
  <div>
    <app-button
      :class="{ inactive: !isLoggedIn }"
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
    if (!this.$route.meta.levelSaved) {
      this.saveLevel();
    } else {
      this.updateLevel();
    }
  }
}
</script>
