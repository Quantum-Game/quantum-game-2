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
  <g
    v-for="[coord, { threshold, value, text }] in goalPercents"
    :key="`goal-${coord.x}-${coord.y}`"
  >
    <template v-if="$flags.circleAbsorptions">
      <AbsorptionCircle :coord="coord" :threshold="threshold" :value="value" />
      <text
        :x="(coord.x + 0.5) * 64"
        :y="coord.y * 64 - 2"
        text-anchor="middle"
        class="goal-probability"
        :class="{ 'goal-met': value >= threshold }"
      >
        {{ text }}
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
        {{ text }}
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
import { histogram } from 'd3-array'
export default defineComponent({
  components: {
    AbsorptionCircle,
    AbsorptionBar,
  },
  props: {
    absorptions: { type: Map as PropType<Map<Coord, number>>, required: true },
    goals: { type: Map as PropType<Map<Coord, number>>, required: true },
    histogram: { type: Map as PropType<Map<Coord, number>>, required: false },
    useHistogram: { type: Boolean, default: false },
  },
  setup(props) {
    const nonGoalPercents = computed(() => {
      const goals = props.goals
      return new Map(iFilter(props.absorptions, ([coord]) => !goals.has(coord)))
    })
    const goalPercents = computed(() => {
      const goals = props.goals
      const absorptions = props.absorptions
      const histogram = props.useHistogram ? props.histogram : null
      return mapEntries(goals, ([coord, threshold]) => {
        const value = absorptions.get(coord) ?? 0
        const text =
          histogram != null ? `${histogram.get(coord) ?? 0}` : `${(value * 100).toFixed(1)}%`

        return [coord, { threshold, value, text }]
      })
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
