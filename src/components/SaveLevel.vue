<template>
  <div>
    <a v-if="!$route.meta.publicRoute" @click.prevent="handleClick"
      ><app-button type="special"> Save Level </app-button>
    </a>
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
  saveLevel() {
    $userStore.dispatch('SAVE_LEVEL', this.$store.state);
  }
  updateLevel() {
    $userStore.dispatch('UPDATE_LEVEL', this.$store.state);
  }

  hendleClick() {
    if (!this.$route.meta.levelSaved) {
      this.saveLevel();
    } else {
      this.updateLevel();
    }
  }
}
</script>

<style lang="scss" scoped></style>
