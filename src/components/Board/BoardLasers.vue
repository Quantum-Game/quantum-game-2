<template>
  <!-- LASER PATH -->
  <g class="lasers">
    <g
      v-for="(laser, index) in individualLaserPath"
      :key="'laser' + index"
      :v-if="individualLaserPath.length > 0"
    >
      <path
        :d="laser"
        stroke-dasharray="8 8"
        fill="transparent"
        stroke="red"
        stroke-width="3"
        class="laserPath"
      />
    </g>
  </g>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { ParticleInterface } from '@/engine/interfaces';
import Grid from '@/engine/Grid';
import Level from '@/engine/Level';
import Laser from '@/engine/Laser';

@Component
export default class Board extends Vue {
  @State level!: Level;
  tileSize: number = 64;

  get lasers() {
    return new Laser(this.level.grid).computePaths();
  }

  /**
   * Create laser path through the lasers points
   * @returns SVG laser path
   */
  laserPath(): string {
    let pathStr = '';
    if (this.lasers.length > 0) {
      const originX = this.centerCoord(this.lasers[0].coord.x);
      const originY = this.centerCoord(this.lasers[0].coord.y);
      pathStr += `M ${originX} ${originY} `;
      this.lasers.forEach((laser: any) => {
        const x = this.centerCoord(laser.coord.x);
        const y = this.centerCoord(laser.coord.y);
        pathStr += ` L ${x} ${y} `;
      });
      pathStr += ' ';
    }
    return pathStr;
  }

  get individualLaserPath(): string[] {
    const pathsStr: string[] = [];
    if (this.lasers.length > 0) {
      this.lasers.forEach((laser: any) => {
        let pathStr = '';
        const originX = this.centerCoord(laser.coord.x);
        const originY = this.centerCoord(laser.coord.y);
        pathStr += `M ${originX} ${originY} `;
        switch (laser.direction) {
          case 0:
            pathStr += ` H ${this.centerCoord(laser.coord.x + 1)}`;
            break;
          case 90:
            pathStr += ` V ${this.centerCoord(laser.coord.y - 1)}`;
            break;
          case 180:
            pathStr += ` H ${this.centerCoord(laser.coord.x - 1)}`;
            break;
          case 270:
            pathStr += ` V ${this.centerCoord(laser.coord.y + 1)}`;
            break;
          default:
            throw new Error(`Laser has wrong direction: ${laser.direction}°`);
        }
        pathsStr.push(pathStr);
      });
    }
    return pathsStr;
  }

  /**
   * Compute the cell center at a specific coordinate for grid dots
   * @returns x, y pixel coordinates
   */
  centerCoord(val: number): number {
    return (val + 0.5) * this.tileSize;
  }
}
</script>

<style lang="scss" scoped>
.lasers {
  width: 100%;
  height: 100%;
  .laserPath {
    stroke-dasharray: 8;
    animation-name: dash;
    animation-duration: 4s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: reverse;
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 64;
    }
  }
}
</style>
