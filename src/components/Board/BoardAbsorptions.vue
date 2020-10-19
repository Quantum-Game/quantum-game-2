<template>
  <!-- PROBABILITY -->
  <text
    v-for="[coord, probability] in nonGoalPercents"
    :key="`probability-${coord.x}-${coord.y}`"
    :x="(coord.x + 0.5) * 64"
    :y="coord.y * 64"
    text-anchor="middle"
    class="probability"
  >
    {{ (probability * 100).toFixed(1) }}%
  </text>
  <!-- GOALS -->
  <g v-for="[coord, { threshold, value }] in goalPercents" :key="`goal-${coord.x}-${coord.y}`">
    <template v-if="$flags.circleAbsorptions">
      <AbsorptionCircle :coord="coord" :threshold="threshold" :value="value" />
      <text
        :x="(coord.x + 0.5) * 64"
        :y="coord.y * 64 - 2"
        text-anchor="middle"
        class="goal-probability"
        :class="{ 'goal-met': value >= threshold }"
      >
        {{ (value * 100).toFixed(1) }}%
      </text>
    </template>
    <template v-else>
      <AbsorptionBar :coord="coord" :threshold="threshold" :value="value" />
      <text
        :x="(coord.x + 0.5) * 64"
        :y="coord.y * 64 - 12"
        text-anchor="middle"
        class="goal-probability"
        :class="{ 'goal-met': value >= threshold }"
      >
        {{ (value * 100).toFixed(1) }}%
      </text>
    </template>
  </g>
</template>

<script lang="ts">
import { Coord } from '@/engine/model'
import { iFilter, mapEntries } from '@/itertools'
import { computed, defineComponent, PropType } from 'vue'
import AbsorptionCircle from './AbsorptionCircle.vue'
import AbsorptionBar from './AbsorptionBar.vue'
export default defineComponent({
  components: {
    AbsorptionCircle,
    AbsorptionBar,
  },
  props: {
    absorptions: { type: Map as PropType<Map<Coord, number>>, required: true },
    goals: { type: Map as PropType<Map<Coord, number>>, required: true },
  },
  setup(props) {
    const nonGoalPercents = computed(() => {
      const goals = props.goals
      return new Map(iFilter(props.absorptions, ([coord]) => !goals.has(coord)))
    })
    const goalPercents = computed(() => {
      const goals = props.goals
      const absorptions = props.absorptions
      return mapEntries(goals, ([coord, threshold]) => [
        coord,
        { threshold, value: absorptions.get(coord) ?? 0 },
      ])
    })
    return {
      nonGoalPercents,
      goalPercents,
    }
  },
})
</script>

<style lang="scss" scoped>
.probability {
  fill: $fuchsia;
  font-size: 0.8rem;
}

.progress-bar {
  transition: width 0.3s ease-out;
}

.goal-probability {
  fill: mix($fuchsia, $purple, 70%);
  font-size: 0.8rem;
  transition: font-size 0.3s, text-shadow 0.3s, fill 0.3s;
}

.goal-met {
  fill: $fuchsia;
  text-shadow: 0 0 5px mix($fuchsia, $purple);
}
</style>
