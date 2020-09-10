<template>
  <div id="notifications">
    <ul v-if="errors.length" class="errors">
      <li v-for="error in errors" :key="error">{{ error }}</li>
      <li @click="RESET_ERRORS"><router-link to="/">click here to get back</router-link></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { storeNamespace } from '@/store'
import { setup, Vue } from 'vue-class-component'

const errors = storeNamespace('errors')

export default class AppNotifications extends Vue {
  RESET_ERRORS = setup(() => errors.useMutation('RESET_ERRORS'))
  errors = setup(() => errors.useState('errors'))
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
