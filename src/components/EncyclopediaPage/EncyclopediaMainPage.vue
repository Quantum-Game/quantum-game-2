<template>
  <div class="default-content" layout="column u5">
    <div flex layout="column u5" class="underline">
      <h2>Elements</h2>
      <div layout="row wrap start" class="elements">
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
      <encyclopedia-link-list :entryList="conceptNameList" class="link-list" />
    </div>
  </div>
</template>

<script lang="ts">
import AppCell from '@/components/Board/AppCell.vue'
import EncyclopediaLinkList from '@/components/EncyclopediaPage/EncyclopediaLinkList.vue'

import { defineComponent } from 'vue'
import { Elem, elemName, Piece, staticPiece } from '@/engine/model'
import { conceptNameList } from './loadData'

interface LinkPiece {
  to: string
  piece: Piece
}

const linkPieces: LinkPiece[] = [
  { to: '/info/laser', piece: staticPiece(Elem.Laser) },
  { to: '/info/detector', piece: staticPiece(Elem.Detector) },
  { to: '/info/detector-four', piece: staticPiece(Elem.DetectorFour) },
  { to: '/info/rock', piece: staticPiece(Elem.Rock) },
  { to: '/info/mine', piece: staticPiece(Elem.Mine) },
  { to: '/info/mirror', piece: staticPiece(Elem.Mirror) },
  { to: '/info/corner-cube', piece: staticPiece(Elem.CornerCube) },
  { to: '/info/beam-splitter', piece: staticPiece(Elem.BeamSplitter) },
  { to: '/info/polarizing-beam-splitter', piece: staticPiece(Elem.PolarizingBeamSplitter) },
  { to: '/info/sugar-solution', piece: staticPiece(Elem.SugarSolution) },
  { to: '/info/faraday-rotator', piece: staticPiece(Elem.FaradayRotator) },
  { to: '/info/polarizer', piece: staticPiece(Elem.Polarizer) },
  { to: '/info/quarter-wave-plate', piece: staticPiece(Elem.QuarterWavePlate) },
  { to: '/info/half-wave-plate', piece: staticPiece(Elem.HalfWavePlate) },
  { to: '/info/glass', piece: staticPiece(Elem.Glass) },
  { to: '/info/vacuum-jar', piece: staticPiece(Elem.VacuumJar) },
  { to: '/info/absorber', piece: staticPiece(Elem.Absorber) },
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

.elements {
  margin: auto;
}

h2 {
  padding-bottom: 5px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.link-list {
}
</style>
