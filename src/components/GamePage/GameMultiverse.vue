<template>
  <div class="multiverse">
    <svg width="100%" height="100%">
      <!-- NODE -->
      <rect
        v-for="(node, i) in nodes"
        :key="'node' + i"
        :x="node.x"
        :y="node.y"
        :rx="node.rx"
        :ry="node.ry"
        width="50"
        height="50"
      />
    </svg>
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
    this.debugNodes();
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
  debugNodes() {
    this.nodes.forEach((v: any) => {
      console.log(`Node ${v}: ${JSON.stringify(this.graph.node(v))}`);
    });
  }
  debugEdges() {
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
  .node rect {
    stroke: #333;
    fill: #fff;
  }

  .edgePath path {
    stroke: #333;
    fill: #333;
    stroke-width: 1.5px;
  }
}
</style>
