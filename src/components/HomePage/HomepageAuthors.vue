<template>
  <p class="authors">
    Quantum Game is being developed by Quantum Flytrap, founded by
    <a href="https://p.migdal.pl/" target="_blank">Piotr Migdał</a> and
    <a href="http://jankiewiczstudio.com/" target="_blank">Klem Jankiewicz</a>. Key employees: Paweł
    Grabarz, Natalia H. Wileńska, Philippe Cochin, Chiara Decaroli. Generative soundtrack by
    <a href="https://www.paweljanicki.jp/" target="_blank">Pawel Janicki</a>.
    <br />
    Advisor:
    <a href="https://en.wikipedia.org/wiki/Artur_Ekert" target="_blank">Artur Ekert</a> (University
    of Oxford).
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
