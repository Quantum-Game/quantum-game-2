<template>
  <div id="notifications">
    <ul v-if="errors.length" class="errors">
      <li v-for="error in errors" :key="error">{{ error }}</li>
      <li @click="resetErrors"><router-link to="/">click here to get back</router-link></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class AppNotifications extends Vue {
  resetErrors(): void {
    this.$store.commit('RESET_ERRORS')
  }

  get errors(): string[] {
    return this.$store.state.errors
  }
}
</script>

<style lang="scss" scoped>
#notifications {
  display: block;
  position: absolute;

  & .errors {
    list-style: none;
    color: red;
  }
}
</style>
