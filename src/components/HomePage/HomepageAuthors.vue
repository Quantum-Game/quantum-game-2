<template>
  <p class="authors">
    Quantum Game is currently being developed by
    <a href="https://p.migdal.pl/" target="_blank">Piotr Migdał</a>,
    <a href="https://fr.linkedin.com/in/philippe-cochin-b4978231" target="_blank">Philippe Cochin</a
    >, <a href="https://maperseguirvirtute.wordpress.com/" target="_blank">Chiara Decaroli</a>,
    <a href="http://jankiewiczstudio.com/" target="_blank">Klem Jankiewicz</a>,
    <a href="https://www.linkedin.com/in/strebeyko/" target="_blank">Kuba Strebeyko</a>. Generative
    soundtrack by <a href="https://www.paweljanicki.jp/" target="_blank">Pawel Janicki</a>.
  </p>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class HomepageAuthors extends Vue {}
</script>

<style lang="scss" scoped>
a {
  color: rgb(255, 181, 209);
  text-decoration: none;
}
a:hover {
  color: white;
}
</style>
