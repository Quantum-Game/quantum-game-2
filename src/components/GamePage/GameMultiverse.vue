<template>
  <div class="multiverse">
    <h1>NODES:</h1>
    {{ nodes }}
  </div>
</template>

<script lang="ts">
import dagre from 'dagre';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import MultiverseGraph from '@/engine/MultiverseGraph';

@Component({
  components: {}
})
export default class GameMultiverse extends Vue {
  @Prop() readonly multiverse!: MultiverseGraph;

  get graph() {
    return this.multiverse.graph;
  }

  get nodes() {
    return this.multiverse.graph.nodes();
  }
}
</script>

<style lang="scss" scoped>
.multiverse {
  border-top: 1px solid white;
  width: 100%;
  display: block;
  text-align: center;
  color: white;
}
</style>
