<template>
  <div class="testimonials">
    <p v-for="t in testimonials" :key="t.name">
      <i>“{{ t.text }}”</i><br />
      — <b>{{ t.name }}</b> ({{ t.institute }})
    </p>
    <p>
      Cited in
      <a
        href="https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=%22quantum+game+with+photons%22&btnG="
        target="_blank"
        >4 academic publications</a
      >.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const testimonials: { name: string; institute: string; link: string; text: string }[] = [
      {
        name: 'Scott Aaronson',
        institute: 'University of Texas at Austin',
        link: 'https://www.scottaaronson.com/blog/?p=3597',
        text:
          'I tried it and it’s excellent, and best of all clear: unlike virtually every other “quantum game” I’ve tried, it took me only a minute to figure this one out.',
      },
      {
        name: 'James Wootton',
        institute: 'IBM Research',
        link: 'https://twitter.com/decodoku/status/1287758921654992899',
        text:
          'I”ve been playing around with the new “Quantum Game with Photons”. So far it feels like all the fun parts of doing undergraduate physics experiments, while also being a really nice puzzle game!',
      },
      {
        name: 'Monika Schleier-Smith',
        institute: 'Stanford University',
        link: '',
        text:
          'Even when it becomes possible to teach my class in person again, your website could help me scale to a larger class size than is possible when I require equipment for hands-on demonstrations.',
      },
    ]
    return { testimonials }
  },
})
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
