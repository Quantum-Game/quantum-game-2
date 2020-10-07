<template>
  <div class="default-content" layout="column u5" layout-md="row u5">
    <div flex layout="column u5">
      <h2>Elements</h2>
      <div layout="row wrap middle">
        <router-link
          v-for="link in linkPieces"
          :key="link.to"
          :to="link.to"
          class="element"
          layout="column center"
        >
          <svg viewBox="0 0 64 64" width="64" height="64">
            <app-cell :piece="link.piece" />
          </svg>
          <span>{{ elemName(link.piece.type) }}</span>
        </router-link>
      </div>
    </div>
    <div layout="column u5">
      <h2>Concepts</h2>
      <encyclopedia-link-list :entry-list="conceptNameList" class="link-list" />
    </div>
  </div>
</template>

<script lang="ts">
import AppCell from '@/components/Board/AppCell.vue'
import EncyclopediaLinkList from '@/components/EncyclopediaPage/EncyclopediaLinkList.vue'

import { defineComponent } from 'vue'
import { Elem, elemName, Piece, Rotation } from '@/engine/model'
import { conceptNameList } from './loadData'

interface LinkPiece {
  to: string
  piece: Piece
}

function piece(type: Elem): Piece {
  return {
    type,
    rotation: Rotation.Right,
    polarization: Rotation.Right,
    goalThreshold: 0,
    draggable: false,
    rotateable: false,
    releasePoint: null,
  }
}

const linkPieces: LinkPiece[] = [
  { to: '/info/laser', piece: piece(Elem.Laser) },
  { to: '/info/detector', piece: piece(Elem.Detector) },
  { to: '/info/detector-four', piece: piece(Elem.DetectorFour) },
  { to: '/info/rock', piece: piece(Elem.Rock) },
  { to: '/info/mine', piece: piece(Elem.Mine) },
  { to: '/info/mirror', piece: piece(Elem.Mirror) },
  { to: '/info/corner-cube', piece: piece(Elem.CornerCube) },
  { to: '/info/beam-splitter', piece: piece(Elem.BeamSplitter) },
  { to: '/info/polarizing-beam-splitter', piece: piece(Elem.PolarizingBeamSplitter) },
  { to: '/info/sugar-solution', piece: piece(Elem.SugarSolution) },
  { to: '/info/faraday-rotator', piece: piece(Elem.FaradayRotator) },
  { to: '/info/polarizer', piece: piece(Elem.Polarizer) },
  { to: '/info/quarter-wave-plate', piece: piece(Elem.QuarterWavePlate) },
  { to: '/info/half-wave-plate', piece: piece(Elem.HalfWavePlate) },
  { to: '/info/glass', piece: piece(Elem.Glass) },
  { to: '/info/vacuum-jar', piece: piece(Elem.VacuumJar) },
  { to: '/info/absorber', piece: piece(Elem.Absorber) },
]

export default defineComponent({
  components: {
    AppCell,
    EncyclopediaLinkList,
  },
  setup() {
    return {
      linkPieces,
      elemName,
      conceptNameList,
    }
  },
})
</script>

<style lang="scss" scoped>
.element {
  width: 140px;
  height: 120px;
  text-align: center;
}

h2 {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 5px;
  text-align: center;

  @include media('>=medium') {
    text-align: left;
  }
}

.link-list {
  align-self: center;
}
</style>
