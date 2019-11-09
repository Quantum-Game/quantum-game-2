<template>
  <div>
    <a v-if="!$route.meta.publicRoute && !$route.meta.levelSaved" @click.prevent="saveLevel"
      ><app-button type="special"> Save Level </app-button></a
    >
    <a v-if="!$route.meta.publicRoute && $route.meta.levelSaved" @click.prevent="updateLevel"
      ><app-button type="special"> Save Level </app-button></a
    >
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
    $userStore.dispatch('SAVE_LEVEL', this.$store.getters.level);
  }
  updateLevel() {
    $userStore.dispatch('UPDATE_LEVEL', this.$store.getters.level);
  }
}
</script>

<style lang="scss" scoped></style>
