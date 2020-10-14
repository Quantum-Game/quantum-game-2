<template>
  <div class="not-found">
    <h1>404</h1>
    <p>OH NO :(</p>
    <img src="@/assets/graphics/rock_weasel.svg" alt="weasel" />
    <router-link to="/"> <AppButton type="basic">TAKE ME BACK!</AppButton></router-link>
  </div>
</template>

<script lang="ts">
import AppButton from '@/components/AppButton.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    AppButton,
  },
})
</script>

<style lang="scss" scoped>
.not-found {
  color: white;
  align-items: center;
  display: flex;
  flex-direction: column;
  & h1 {
    font-size: 8rem;
    margin-bottom: 2rem;
  }
}
</style>
