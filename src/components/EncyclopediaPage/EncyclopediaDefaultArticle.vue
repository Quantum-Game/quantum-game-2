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
            Basics
          </text>
          <router-link :to="`/info/laser`">
            <laser-cell :style="moveTo(2, 1)" />
          </router-link>
          <router-link :to="`/info/detector`">
            <detector-cell :style="moveTo(4, 1)" />
          </router-link>
          <router-link :to="`/info/detector`">
            <detector-four-cell :style="moveTo(6, 1)" />
          </router-link>
          <router-link :to="`/info/rock`">
            <rock-cell :style="moveTo(8, 1)" />
          </router-link>
          <router-link :to="`/info/mine`">
            <mine-cell :style="moveTo(10, 1)" />
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
          <router-link :to="`/info/mirror`">
            <mirror-cell :style="moveTo(3, 3)" />
          </router-link>
          <router-link :to="`/info/mirror`">
            <corner-cube-cell :style="moveTo(5, 3)" />
          </router-link>
          <router-link :to="`/info/beam-splitter`">
            <beam-splitter-cell :style="moveTo(7, 3)" />
          </router-link>
          <router-link :to="`/info/polarizing-beam-splitter`">
            <polarizing-beam-splitter-cell :style="moveTo(9, 3)" />
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
          <router-link :to="`/info/sugar-solution`">
            <sugar-solution-cell :style="moveTo(3, 5)" />
          </router-link>
          <router-link :to="`/info/faraday-rotator`">
            <faraday-rotator-cell :style="moveTo(5, 5)" />
          </router-link>
          <router-link :to="`/info/polarizer`">
            <polarizer-cell :style="moveTo(7, 5)" />
          </router-link>
          <router-link :to="`/info/quarter-wave-plate`">
            <quarter-wave-plate-cell :style="moveTo(9, 5)" />
          </router-link>

          <text
            :x="6.5 * 64"
            :y="6 * 64 + 40"
            class="title"
            dominant-baseline="middle"
            text-anchor="middle"
          >
            Phase
          </text>
          <router-link :to="`/info/glass`">
            <glass-cell :style="moveTo(4, 7)" />
          </router-link>
          <router-link :to="`/info/vacuum-jar`">
            <vacuum-jar-cell :style="moveTo(6, 7)" />
          </router-link>
          <router-link :to="`/info/absorber`">
            <absorber-cell :style="moveTo(8, 7)" />
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
  SugarSolutionCell,
  GlassCell,
  VacuumJarCell,
  FaradayRotatorCell,
  NonLinearCrystalCell
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
    SugarSolutionCell,
    GlassCell,
    VacuumJarCell,
    FaradayRotatorCell,
    NonLinearCrystalCell
  }
})
export default class EncyclopediaDefaultArticle extends Vue {
  grid = Grid.dummyGrid(8, 13)
  tileSize = 64
  boardHeight = 0

  moveTo(x: number, y: number): {} {
    return {
      transform: `translate(${x * this.tileSize}px, ${y * this.tileSize}px)`
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
a {
  color: white;
  text-align: left;
  text-decoration: none;
}
h1 {
  padding-top: 30px;
}

.title {
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  font-size: 22px;
  fill: white;
  stroke: white;
}

img {
  border-top: 1px solid white;
  padding-top: 30px;
  padding-bottom: 30px;
}

.default-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.entries {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
