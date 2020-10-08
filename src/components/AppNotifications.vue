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
import { defineComponent } from 'vue'

export default defineComponent(() => {
  const errors = storeNamespace('errors')
  return {
    RESET_ERRORS: errors.useMutation('RESET_ERRORS'),
    errors: errors.useState('errors'),
  }
})
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
