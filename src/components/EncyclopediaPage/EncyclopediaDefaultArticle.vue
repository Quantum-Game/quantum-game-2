<template>
  <div class="default-content">
    <h1>ENCYCLOPEDIA</h1>
    <div class="container">
      <div class="svg-container">
        <svg class="grid" :width="totalWidth" :height="totalHeight">
          <!-- DOTS -->
          <board-dots :rows="grid.rows" :cols="grid.cols" />

          <!-- CELLS -->
          <text :x="6.5 * 64" :y="40" class="title" dominant-baseline="middle" text-anchor="middle">
            Start & finish
          </text>
          <router-link :to="`/info/laser`" :style="moveTo(2, 1)">
            <laser-cell />
          </router-link>
          <router-link :to="`/info/detector`" :style="moveTo(4, 1)">
            <detector-cell />
          </router-link>
          <router-link :to="`/info/detector`" :style="moveTo(6, 1)">
            <detector-four-cell />
          </router-link>
          <router-link :to="`/info/rock`" :style="moveTo(8, 1)">
            <rock-cell />
          </router-link>
          <router-link :to="`/info/mine`" :style="moveTo(10, 1)">
            <mine-cell />
          </router-link>

          <text
            :x="6.5 * 64"
            :y="2 * 64 + 40"
            class="title"
            dominant-baseline="middle"
            text-anchor="middle"
          >
            Reflection
          </text>
          <router-link :to="`/info/mirror`" :style="moveTo(3, 3)">
            <mirror-cell />
          </router-link>
          <router-link :to="`/info/corner-cube`" :style="moveTo(5, 3)">
            <corner-cube-cell />
          </router-link>
          <router-link :to="`/info/beam-splitter`" :style="moveTo(7, 3)">
            <beam-splitter-cell />
          </router-link>
          <router-link :to="`/info/polarizing-beam-splitter`" :style="moveTo(9, 3)">
            <polarizing-beam-splitter-cell />
          </router-link>

          <text
            :x="6.5 * 64"
            :y="4 * 64 + 40"
            class="title"
            dominant-baseline="middle"
            text-anchor="middle"
          >
            Polarization
          </text>
          <router-link :to="`/info/sugar-solution`" :style="moveTo(2, 5)">
            <sugar-solution-cell />
          </router-link>
          <router-link :to="`/info/faraday-rotator`" :style="moveTo(4, 5)">
            <faraday-rotator-cell />
          </router-link>
          <router-link :to="`/info/polarizer`" :style="moveTo(6, 5)">
            <polarizer-cell />
          </router-link>
          <router-link :to="`/info/quarter-wave-plate`" :style="moveTo(8, 5)">
            <quarter-wave-plate-cell />
          </router-link>
          <router-link :to="`/info/half-wave-plate`" :style="moveTo(10, 5)">
            <half-wave-plate-cell />
          </router-link>

          <text
            :x="6.5 * 64"
            :y="6 * 64 + 40"
            class="title"
            dominant-baseline="middle"
            text-anchor="middle"
          >
            Phase & intensity
          </text>
          <router-link :to="`/info/glass`" :style="moveTo(4, 7)">
            <glass-cell />
          </router-link>
          <router-link :to="`/info/vacuum-jar`" :style="moveTo(6, 7)">
            <vacuum-jar-cell />
          </router-link>
          <router-link :to="`/info/absorber`" :style="moveTo(8, 7)">
            <absorber-cell />
          </router-link>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Grid from '@/engine/Grid'
import { Vue, Component } from 'vue-property-decorator'
import AppButton from '@/components/AppButton.vue'
import AppCell from '@/components/Board/AppCell.vue'
import BoardDots from '@/components/Board/BoardDots.vue'
import {
  LaserCell,
  MirrorCell,
  BeamSplitterCell,
  PolarizingBeamSplitterCell,
  CoatedBeamSplitterCell,
  CornerCubeCell,
  DetectorCell,
  RockCell,
  MineCell,
  AbsorberCell,
  DetectorFourCell,
  PolarizerCell,
  QuarterWavePlateCell,
  HalfWavePlateCell,
  SugarSolutionCell,
  GlassCell,
  VacuumJarCell,
  FaradayRotatorCell,
  NonLinearCrystalCell,
} from '@/components/Board/Cell/index'

@Component({
  components: {
    AppButton,
    AppCell,
    BoardDots,
    LaserCell,
    MirrorCell,
    BeamSplitterCell,
    PolarizingBeamSplitterCell,
    CoatedBeamSplitterCell,
    CornerCubeCell,
    DetectorCell,
    RockCell,
    MineCell,
    AbsorberCell,
    DetectorFourCell,
    PolarizerCell,
    QuarterWavePlateCell,
    HalfWavePlateCell,
    SugarSolutionCell,
    GlassCell,
    VacuumJarCell,
    FaradayRotatorCell,
    NonLinearCrystalCell,
  },
})
export default class EncyclopediaDefaultArticle extends Vue {
  grid = Grid.dummyGrid(8, 13)
  tileSize = 64
  boardHeight = 0

  moveTo(x: number, y: number): {} {
    return {
      transform: `translate(${x * this.tileSize}px, ${y * this.tileSize}px)`,
    }
  }

  get totalWidth(): number {
    return this.grid.cols * this.tileSize
  }

  get totalHeight(): number {
    return this.grid.rows * this.tileSize
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 1.5rem;
  padding-top: 30px;
}

.title {
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  fill: white;
  stroke: none;
}

.default-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
