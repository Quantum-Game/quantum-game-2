<template>
  <div class="container">
    <div class="svg-container">
      <svg ref="grid" class="grid" :width="totalWidth" :height="totalHeight">
        <!-- DOTS -->
        <g class="dots">
          <g v-for="(row, y) in grid.rows + 1" :key="y">
            <g v-for="(column, x) in grid.cols + 1" :key="x">
              <circle :cx="x * tileSize" :cy="y * tileSize" r="1" fill="#edeaf4" />
            </g>
          </g>
        </g>

        <!-- PHOTONS -->
        <g
          v-for="(particle, i) in selectedFrame.polarizationSuperpositions"
          :key="`particle-${i}-(${particle.coord.x},${particle.coord.y})-${particle.direction}`"
          :style="computeParticleStyle(particle)"
          class="photons"
        >
          <app-photon
            name
            :particle="particle"
            :width="64"
            :height="64"
            :margin="0"
            :display-magnetic="false"
            :display-electric="true"
            :display-gaussian="true"
            :display-opacity="true"
            :sigma="0.25"
          />
        </g>

        <!-- LASERS -->
        <board-lasers :pathParticles="pathParticles" />

        <!-- CELLS -->
        <app-cell
          v-for="(cell, i) in nonVoidCells"
          :key="`cell-${i}-(${cell.coord.x},${cell.coord.y})-${cell.element.name})`"
          :cell="cell"
          :tileSize="tileSize"
          @click.native="rotate(cell)"
        />
      </svg>
    </div>
    <div class="btn-group">
      <span
        v-for="(frame, index) in frames"
        :key="'frame' + index"
        @mouseover="selectedFrameId = index"
      >
        <button :class="{ selected: selectedFrameId === index }">{{ index }}</button>
      </span>
    </div>
    <div class="ket">{{ selectedFrame.ketString }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Grid, Cell } from '@/engine/classes';
import { ParticleInterface, GridInterface } from '@/engine/interfaces';
import AppPhoton from '@/components/AppPhoton.vue';
import BoardDots from '@/components/Board/BoardDots.vue';
import AppCell from '@/components/Board/AppCell.vue';
import QuantumFrame from '@/engine/QuantumFrame';
import QuantumSimulation from '@/engine/QuantumSimulation';

const dummyGrid = Grid.dummyGrid();
const dummyGridInterface = dummyGrid.exportGrid();

@Component({
  components: {
    AppPhoton,
    AppCell
  }
})
export default class EncyclopediaBoard extends Vue {
  @Prop({ default: () => dummyGridInterface }) gridObj!: GridInterface;
  @Prop({ default: () => 10 }) readonly maxSteps!: number;
  @Prop({ default: () => 2 }) readonly defaultStep!: number;

  tileSize = 64; // sounds like a prop or constant
  selectedFrameId = 0;
  frames: QuantumFrame[] = [];
  grid = new Grid(
    this.gridObj.rows,
    this.gridObj.cols,
    this.gridObj.cells.map((jsonCell) => Cell.importCell(jsonCell))
  );

  $refs!: {
    grid: HTMLElement;
  };

  created() {
    this.reset();
  }

  reset() {
    const quantumSimulation = new QuantumSimulation(this.grid);
    quantumSimulation.initializeFromLaser('H');
    quantumSimulation.nextFrames(this.maxSteps);
    this.frames = quantumSimulation.frames;
    this.selectedFrameId = Math.min(this.selectedFrameId, this.frames.length - 1);
    this.selectedFrameId = this.defaultStep;
  }

  get selectedFrame() {
    return this.frames[this.selectedFrameId];
  }

  get nonVoidCells() {
    return this.grid.unvoid.cells;
  }

  get frameNumber(): number {
    return this.frames.length;
  }

  /**
   * Rotate element (e.g. to be used on click).
   */
  rotate(cell: Cell) {
    cell.rotate();
    this.reset();
    this.$emit('updateRotation', cell);
  }

  get totalWidth(): number {
    return this.grid.cols * this.tileSize;
  }
  get totalHeight(): number {
    return this.grid.rows * this.tileSize;
  }

  centerCoord(val: number): number {
    return (val + 0.5) * this.tileSize;
  }

  computeParticleStyle(particle: ParticleInterface): {} {
    const originX = this.centerCoord(particle.coord.x);
    const originY = this.centerCoord(particle.coord.y);
    return {
      transform: `
        translate(${particle.coord.x * this.tileSize}px, ${particle.coord.y * this.tileSize}px)`
    };
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: inline-block;
  margin-bottom: 30px;
  .svg-container {
    padding: 20px;
  }
}

.btn-group {
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;

  button {
    font-size: 0.8rem;
    font-family: 'Montserrat', Helvetica, Arial, sans-serif;
    font-weight: bold;
    background-color: #5c00d3;
    border: none;
    color: white;
    padding: 5px 10px;
    margin: 5px;
    cursor: pointer;

    &:not(:last-child) {
      border-right: none;
    }
  }

  &:after {
    content: '';
    clear: both;
    display: table;
  }

  button:hover {
    background-color: white;
    color: #5c00d3;
  }

  .selected {
    background-color: white;
    color: #5c00d3;
  }
}
</style>
