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
    </article>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import EntrySection, { ISection } from './EntrySection.vue';
import Photon from '../game/Photon.vue';
import QButton from '../components/QButton.vue';
import { getEntry } from './entries';
import { Level } from 'quantumweasel';
import Egrid from '../game/sections/EGrid.vue';
import BeamSplitterLevel1 from '../game/levels/encyclopedia/BeamSplitterLevel1.json';
import BeamSplitterLevel2 from '../game/levels/encyclopedia/BeamSplitterLevel2.json';

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
    Photon
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
    padding-right:20%;
    padding-left:20%;
    padding-bottom: 20px;

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
.boards {
  display: flex;
  // flex-direction: row;
  justify-content: space-around;
  width: 100%;
  border-bottom: 1px solid #8e819d;
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
