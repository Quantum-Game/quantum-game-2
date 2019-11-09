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

  mounted() {
    this.debug();
  }

  /**
   * Getters
   */
  get graph() {
    return this.multiverse.graph;
  }
  get nodes() {
    return this.multiverse.graph.nodes();
  }
  get edges() {
    return this.multiverse.graph.edges();
  }
  /**
   * Debug the computed nodes and edges properties
   */
  debug() {
    this.nodes.forEach((v: any) => {
      console.log(`Node ${v}: ${JSON.stringify(this.graph.node(v))}`);
    });

    this.edges.forEach((e: { v: any; w: any }) => {
      console.log(`Edge ${e.v} -> ${e.w}: ${JSON.stringify(this.graph.edge(e))}`);
    });
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
