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
    <rect fill="#4F2F7B" :x="coord.x * 64 + 2" :y="coord.y * 64 - 8" :width="64 - 4" height="5" />
    <rect
      fill="url(#progress-gradient)"
      :x="coord.x * 64 + 2"
      :y="coord.y * 64 - 8"
      :width="(64 - 4) * value"
      height="5"
      class="progress-bar"
    />

    <rect
      stroke="white"
      :x="coord.x * 64 + 2 + (64 - 4) * threshold"
      :y="coord.y * 64 - 9"
      :width="0.01"
      height="7"
    />
    <text
      :x="(coord.x + 0.5) * 64"
      :y="coord.y * 64 - 12"
      text-anchor="middle"
      class="goal-probability"
      :class="{ 'goal-met': value >= threshold }"
    >
      {{ (value * 100).toFixed(1) }}%
    </text>
  </g>
</template>

<script lang="ts">
import { Coord } from '@/engine/model'
import { iFilter, mapEntries } from '@/itertools'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
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
