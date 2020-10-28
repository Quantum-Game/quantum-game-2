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
            <AppCell :piece="link.piece" />
          </svg>
          <span>{{ elemName(link.piece.type) }}</span>
        </router-link>
      </div>
    </div>
    <div layout="column u5">
      <h2>Concepts</h2>
      <EncyclopediaLinkList :entryList="conceptNameList" class="link-list" />
    </div>
  </div>
</template>

<script lang="ts">
import AppCell from '@/components/Board/AppCell.vue'
import EncyclopediaLinkList from '@/components/EncyclopediaPage/EncyclopediaLinkList.vue'

import { defineComponent } from 'vue'
import { Elem, elemName, Piece, defaultPiece } from '@/engine/model'
import { conceptNameList } from './loadData'

interface LinkPiece {
  to: string
  piece: Piece
}

const linkPieces: LinkPiece[] = [
  { to: '/info/laser', piece: defaultPiece(Elem.Laser) },
  { to: '/info/detector', piece: defaultPiece(Elem.Detector) },
  { to: '/info/detector-four', piece: defaultPiece(Elem.DetectorFour) },
  { to: '/info/rock', piece: defaultPiece(Elem.Rock) },
  { to: '/info/mine', piece: defaultPiece(Elem.Mine) },
  { to: '/info/mirror', piece: defaultPiece(Elem.Mirror) },
  { to: '/info/corner-cube', piece: defaultPiece(Elem.CornerCube) },
  { to: '/info/beam-splitter', piece: defaultPiece(Elem.BeamSplitter) },
  { to: '/info/polarizing-beam-splitter', piece: defaultPiece(Elem.PolarizingBeamSplitter) },
  { to: '/info/sugar-solution', piece: defaultPiece(Elem.SugarSolution) },
  { to: '/info/faraday-rotator', piece: defaultPiece(Elem.FaradayRotator) },
  { to: '/info/polarizer', piece: defaultPiece(Elem.Polarizer) },
  { to: '/info/quarter-wave-plate', piece: defaultPiece(Elem.QuarterWavePlate) },
  { to: '/info/half-wave-plate', piece: defaultPiece(Elem.HalfWavePlate) },
  { to: '/info/glass', piece: defaultPiece(Elem.Glass) },
  { to: '/info/vacuum-jar', piece: defaultPiece(Elem.VacuumJar) },
  { to: '/info/absorber', piece: defaultPiece(Elem.Absorber) },
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
