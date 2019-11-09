<template>
  <svg ref="grid-wrapper" class="grid" :width="totalWidth" :height="totalHeight">
    <!-- DOTS -->
    <board-dots :gridDimensions="gridDimensions" />

    <!-- LASER PATH -->
    <board-lasers :pathParticles="pathParticles" />

    <!-- PHOTONS -->
    <g
      v-for="(particle, index) in particles"
      :key="'particle' + index"
      :v-if="particles.length > 0"
      :style="computeParticleStyle(particle)"
      class="photons"
    >
      <app-photon
        name
        :particle="particle"
        :animate="2"
        :margin="0"
        :display-magnetic="true"
        :display-electric="false"
        :display-gaussian="false"
        :sigma="0.25"
      />
    </g>

    <!-- CELLS -->
    <app-cell
      v-for="(cell, i) in grid.cells"
      :key="'cell' + i"
      :cell="cell"
      :tileSize="tileSize"
      @updateCell="updateCell"
    />

    <!-- PROBABILITY -->
    <text
      v-for="(probability, i) in probabilities"
      :key="'probability' + i"
      :x="(probability.x + 0.5) * 64"
      :y="probability.y * 64"
      text-anchor="middle"
      class="probability"
    >
      {{ (probability.probability * 100).toFixed(1) }}%
    </text>

    <!-- SPEECH BUBBLES -->
    <speech-bubble
      v-for="(hint, index) in hints"
      :key="`hint${index}`"
      :hint="hint"
      :tileSize="tileSize"
    />
  </svg>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import Coord from '@/engine/Coord';
import Cell from '@/engine/Cell';
import Grid from '@/engine/Grid';
import Level from '@/engine/Level';
import Particle from '@/engine/Particle';
import { ParticleInterface, CellInterface, HintInterface } from '@/engine/interfaces';
import AppCell from '@/components/Board/AppCell.vue';
import BoardLasers from '@/components/Board/BoardLasers.vue';
import BoardDots from '@/components/Board/BoardDots.vue';
import AppPhoton from '@/components/AppPhoton.vue';
import SpeechBubble from '@/components/SpeechBubble.vue';

@Component({
  components: {
    AppCell,
    AppPhoton,
    BoardLasers,
    BoardDots,
    SpeechBubble
  }
})
export default class Board extends Vue {
  @Prop({ default: [] }) readonly particles!: ParticleInterface[];
  @Prop({ default: '' }) readonly paths!: string;
  @Prop() readonly grid!: Grid;
  @Prop() readonly hints!: HintInterface[];
  @Prop({ default: [] }) readonly pathParticles!: Particle[];
  @Prop({ default: '' }) readonly probabilities!: string;
  @State activeCell!: Cell;
  // @State level!: Level;
  // @Mutation('REMOVE_FROM_CURRENT_TOOLS') mutationRemoveFromCurrentTools!: (cell: Cell) => void;
  // @Mutation('UPDATE_GRID_CELL') mutationUpdateGridCell!: (cell: Cell) => void;
  tileSize: number = 64;

  $refs!: {
    'grid-wrapper': HTMLElement;
  };

  mounted() {
    window.addEventListener('resize', this.assessTileSize);
    this.assessTileSize();
  }

  assessTileSize(): void {
    // const currentWidth = this.$refs.grid.getBoundingClientRect().width;
    // this.tileSize = currentWidth / this.grid.cols;
    this.tileSize = 64;
  }

  get totalWidth(): number {
    return this.grid.cols * this.tileSize;
  }
  get totalHeight(): number {
    return this.grid.rows * this.tileSize;
  }

  computeProbStyle(probability: { x: number; y: number; probability: number }) {
    const originX = this.centerCoord(probability.x);
    const originY = this.centerCoord(probability.y);
    return {
      // 'transform-origin': `${originX}px ${originY}px`,
      transform: `translate: ${probability.x * this.tileSize}px ${probability.y * this.tileSize}px`,
      fill: 'white'
    };
  }

  /**
   * Compute the cell center at a specific coordinate for grid dots
   * @returns x, y pixel coordinates
   */
  centerCoord(val: number): number {
    return (val + 0.5) * this.tileSize;
  }

  computeParticleStyle(particle: Particle): {} {
    const originX = this.centerCoord(particle.coord.x);
    const originY = this.centerCoord(particle.coord.y);
    return {
      // 'transform-origin': `${originX}px ${originY}px`,
      transform: `translate(${particle.coord.x * this.tileSize}px, ${particle.coord.y *
        this.tileSize}px)`
    };
  }

  /**
   * Used to move or swap cells
   * @params coord to move to
   * @returns boolean
   */
  updateCell(cell: Cell): void {
    // emit drilling...
    console.log('board cell clicked');

    // const sourceCell = this.activeCell;
    // const targetCell = this.level.grid.get(coord);
    // const mutatedCells: Cell[] = this.level.grid.move(sourceCell, targetCell);
    // mutatedCells.forEach((cell) => {
    //   this.level.grid.set(cell);
    // });
    this.$emit('updateSimulation');
    this.$emit('updateCell', cell);
  }
  deleteCell(cell: Cell): void {
    // emit drilling...
    console.log('board cell clicked');

    // const sourceCell = this.activeCell;
    // const targetCell = this.level.grid.get(coord);
    // const mutatedCells: Cell[] = this.level.grid.move(sourceCell, targetCell);
    // mutatedCells.forEach((cell) => {
    //   this.level.grid.set(cell);
    // });
    this.$emit('updateSimulation');
    // this.$emit('updateGrid', coord);
  }

  /**
   * Create laser path through the lasers points
   * @returns SVG laser path
   */
  photonPath(): string {
    let pathStr = '';
    if (this.particles.length > 0) {
      const originX = this.centerCoord(this.particles[0].coord.x);
      const originY = this.centerCoord(this.particles[0].coord.y);
      pathStr += `M ${originX} ${originY} `;
    }
    return pathStr;
  }

  // HELPING FUNCTIONS
  element(y: number, x: number): CellInterface {
    const cells = this.grid.cells.filter((cell: Cell) => cell.coord.x === x && cell.coord.y === y);
    if (cells.length > 0) {
      return cells[0].exportCell();
    }
    return {
      coord: { x, y },
      element: 'Void',
      rotation: 0,
      frozen: false
    };
  }

  get gridDimensions() {
    const {
      tileSize,
      grid: { cols, rows }
    } = this;
    return { cols, rows, tileSize };
  }
}
</script>

<style lang="scss" scoped>
.probability {
  fill: white;
}
</style>
