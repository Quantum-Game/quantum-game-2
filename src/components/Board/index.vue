<template>
<div ref="boardScaler" class="board_scaler" :style="{height: boardHeight + 'px'}">
  
    <svg ref="gridWrapper" :style="scalerStyle" class="grid" :width="totalWidth" :height="totalHeight">
      <!-- DOTS -->
      <board-dots :rows="grid.rows + 1" :cols="grid.cols + 1" />
  
      <!-- LASER PATH -->
      <board-lasers :pathParticles="pathParticles" />
  
      <!-- PHOTONS -->
      <g
        v-for="(particle, index) in particles"
        :key="'particle' + index"
        :v-if="particles.length > 0"
        :style="computeParticleStyle(particle)"
        class="photons"
        @mouseenter.native="handleMouseEnter(particle.coord)"
      >
        <app-photon
          name
          :particle="particle"
          :animate="2"
          :margin="2"
          :display-magnetic="false"
          :display-electric="true"
          :display-gaussian="true"
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
        @mouseover.native="handleMouseEnter(cell.coord)"
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
</div>
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
  data() {
    return {
      scalerStyle: {
        transform: `scale(1)`,
      },
      boardHeight: 640
      
    }
  }
  @Prop({ default: [] }) readonly particles!: Particle[];
  @Prop() readonly grid!: Grid;
  @Prop() readonly hints!: HintInterface[];
  @Prop({ default: [] }) readonly pathParticles!: Particle[];
  @Prop({ default: '' }) readonly probabilities!: string;
  @Mutation('SET_HOVERED_PARTICLE') mutationSetHoveredParticles!: (particles: Particle[]) => void;
  @Mutation('SET_HOVERED_CELL') mutationSetHoveredCell!: (cell: Cell) => void;
  @State hoveredParticles!: Particle[];
  @State hoveredCell!: Cell;
  @State activeCell!: Cell;
  tileSize: number = 64;

  $refs!: {
    'gridWrapper': HTMLElement;
  };

  mounted() {
    window.addEventListener('resize', this.assessTileSize);
    this.assessTileSize();
  }

  /**
   * Handle mouse over from cell and photons
   */
  handleMouseEnter(coord: Coord) {
    const cell = this.grid.get(coord);
    const particles = this.particles.filter((particle) => {
      return particle.coord.equal(coord);
    });
    if (cell !== this.hoveredCell && !cell.isVoid) {
      this.mutationSetHoveredCell(cell);
    }
    if (particles.length > 0) {
      this.mutationSetHoveredParticles(particles);
    }
  }

  assessTileSize(): void {
    const currentWidth = this.$refs.boardScaler.getBoundingClientRect().width;
    const currentHeight = this.$refs.gridWrapper.getBoundingClientRect().height;
    this.$data.scalerStyle = {
      transform: `scale(${currentWidth / 870})`
    }
    this.$data.boardHeight = currentHeight;
    //this.tileSize = currentWidth / this.grid.cols;
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
      transform: `translate(${particle.coord.x * this.tileSize}px, ${particle.coord.y *
        this.tileSize}px)`
    };
  }

  updateCell(cell: Cell): void {
    // emit drilling...
    this.$emit('updateCell', cell);
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
}
</script>

<style lang="scss" scoped>
.probability {
  fill: #ff0055;
  font-size: 0.8rem;
}

.board_scaler {
  max-width: 1400px;
  @media screen and (min-width: 1001px) {
    margin-bottom: 100px;
  }
}
.grid {
  transform-origin: 0 50%;
  @media screen and (max-width: 1000px) {
    transform-origin: 0 0;
  }
}
</style>
