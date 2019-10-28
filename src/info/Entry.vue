<template>
  <div v-if="entry" class="entry">
    <router-link to="/info">
      <q-button type="basic">ENCYCLOPEDIA</q-button>
    </router-link>
    <article>
      <h1 class="title">{{ entry.title.toUpperCase() }}</h1>
      <h2 class="short">{{ entry.short }}</h2>

      <div class="boards">
        <div v-for="(level, i) in levels" :key="'level' + i">
          <Egrid :levelObj="level.levelObj" :step="level.step" class="board" />
        </div>
      </div>

      <entry-section
        v-for="(section, index) in entry.sections"
        :key="section.title"
        :section="section"
        :should-be-open-on-init="index === 0"
      />

      <!-- I will but things below in a separate component -->
      <div>
        <select v-model="dimOrder">
          <option value="dir pol">dir pol</option>
          <option value="pol dir">pol dir</option>
        </select>
        <OperatorViewer
          :labelsIn="basis"
          :labelsOut="basis"
          :matrixElements="matrixElements"
        />
      </div>

    </article>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import EntrySection, { ISection } from './EntrySection.vue';
import OperatorViewer from './OperatorViewer.vue';
import Photon from '../game/Photon.vue';
import QButton from '../components/QButton.vue';
import { getEntry } from './entries';
import { Level } from 'quantumweasel';
import Egrid from '../game/sections/EGrid.vue';
import BeamSplitterLevel1 from '../game/levels/encyclopedia/BeamSplitterLevel1.json';
import BeamSplitterLevel2 from '../game/levels/encyclopedia/BeamSplitterLevel2.json';
import * as qt from 'quantum-tensors';

interface IEntryList {
  [index: string]: IEntry;
}

interface IEntry {
  title: string;
  short?: string;
  sections: Array<ISection>;
}

@Component({
  components: {
    EntrySection,
    Egrid,
    QButton,
    Photon,
    OperatorViewer,
  }
})
export default class Entry extends Vue {
  entry: IEntry = {
    title: '',
    sections: []
  };

  levels = [{ levelObj: BeamSplitterLevel1, step: 4 }, { levelObj: BeamSplitterLevel2, step: 3 }];

  created() {
    this.loadEntry();
  }

  @Watch('$route')
  loadEntry() {
    if (this.entryURL) {
      this.entry = getEntry(this.entryURL);
    }
    if (!this.entry.title) {
      this.$router.push({ name: '404' });
    }
  }

  get entryURL(): string {
    return this.$route.params.entry;
  }

  // 
  // matrix viewer
  //

  dimOrder = "dir pol"
  operator = qt.beamSplitter(45)

  // XXX: both below are quick and dirty, hardcoded or semi-hardcoded
  // TODO: make in quantum-tensors
  get basis() { 
    if (this.dimOrder === "dir pol") {
      return ["⇢↔", "⇢↕", "⇡↔", "⇡↕", "⇠↔", "⇠↕", "⇣↔", "⇣↕"]
    } else {
      return ["↔⇢", "↔⇡", "↔⇠", "↔⇣", "↕⇢", "↕⇡", "↕⇠", "↕⇣"]
    }
  }

  get matrixElements() {
    if (this.dimOrder === "dir pol") {
      return this.operator.entries.map((entry) => {
        return {
          i: 2 * entry.coordIn[0] + entry.coordIn[1],
          j: 2 * entry.coordOut[0] + entry.coordOut[1],
          re: entry.value.re,
          im: entry.value.im,
        }
      })
    } else {
      return this.operator.entries.map((entry) => {
        return {
          i: entry.coordIn[0] + 4 * entry.coordIn[1],
          j: entry.coordOut[0] + 4 * entry.coordOut[1],
          re: entry.value.re,
          im: entry.value.im,
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.entry {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  & .title {
    font-size: 2rem;
    font-weight: bold;
  }
  & .short {
    font-size: 1rem;
  }
  & .go-back {
    font-weight: bold;
    text-decoration: none;
    color: white;
  }
  & p {
    line-height: 2em;
    text-align: left;
  }
}

h1 {
  padding-bottom: 1rem;
  border-bottom: 1px solid white;
  text-align: center;
}

.placeholder {
  padding-top: 2rem;
  width: 100%;
  border-bottom: 1px solid #8e819d;
  & .board {
    width: 100%;
    margin: 0 auto 0rem;
    height: 200px;
    text-align: center;
    padding-bottom: 4rem;
    & span {
      font-size: 1rem;
      color: gold;
    }
  }
}
</style>
