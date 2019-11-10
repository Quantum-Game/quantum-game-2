<template>
  <div ref="multiverseWrapper" class="multiverse">
    <!-- <h3>MULTIVERSE</h3> -->
    <svg width="100%">
      <!-- ARROWHEAD -->
      <defs>
        <marker
          id="arrowhead-past"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="4"
          markerHeight="3"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" stroke="none" fill="darkgrey" />
        </marker>
        <marker
          id="arrowhead-present"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="4"
          markerHeight="3"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" stroke="none" fill="red" />
        </marker>
        <marker
          id="arrowhead-future"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="4"
          markerHeight="3"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" stroke="none" fill="purple" />
        </marker>
      </defs>

      <!-- NODE -->
      <g :style="computedStyle">
        <g v-for="(node, i) in nodes" :key="'node' + i" :class="computeNodeClass(node)">
          <rect
            class="nodeRect"
            :x="node.x - 10"
            :y="node.y - 10"
            :rx="node.rx"
            :ry="node.ry"
            @mouseover="handleMouseOver(node.fIndex)"
          />
          <text class="nodeText" :x="node.x" :y="node.y + 4" text-anchor="middle">
            {{ node.label }}
          </text>
        </g>
        <!-- EDGE -->
        <g v-for="(edge, i) in edges" :key="'edge' + i" :class="computeEdgeClass(edge)">
          <path
            :d="computeEdgePath(edge.points)"
            :stroke-width="edge.width"
            :marker-end="computeArrowHead(edge)"
          />
        </g>
      </g>
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
  @Prop() readonly activeId!: number;
  $refs!: {
    multiverseWrapper: HTMLElement;
  };
  rect = { width: 0 };

  handleMouseOver(activeId: number): void {
    this.$emit('changeActiveFrame', activeId);
  }

  mounted() {
    this.rect = this.$refs.multiverseWrapper.getBoundingClientRect();
    this.debugNodes();
  }

  computeNodeClass(node: { fIndex: number }): string[] {
    let timeClass = '';
    if (node.fIndex < this.activeId) {
      timeClass = 'past';
    } else if (node.fIndex === this.activeId) {
      timeClass = 'present';
    } else {
      timeClass = 'future';
    }
    return ['node', timeClass];
  }

  computeEdgeClass(edge: { fIndex: number }): string[] {
    let timeClass = '';
    if (edge.fIndex < this.activeId) {
      timeClass = 'past';
    } else if (edge.fIndex === this.activeId) {
      timeClass = 'present';
    } else {
      timeClass = 'future';
    }
    return ['edge', timeClass];
  }

  computeArrowHead(edge: { fIndex: number }): string {
    let timeClass = '';
    if (edge.fIndex < this.activeId) {
      timeClass = 'past';
    } else if (edge.fIndex === this.activeId) {
      timeClass = 'present';
    } else {
      timeClass = 'future';
    }
    return `url(#arrowhead-${timeClass})`;
  }

  get computedStyle() {
    const xCenterOffset = (this.rect.width - this.graph.graph().width) / 2;
    // const yCenterOffset = this.graph.graph().height + 40;
    return {
      transform: `translate(${xCenterOffset}px, ${0}px)`
    };
  }
  /**
   * Getters
   */
  get graph() {
    return this.multiverse.graph;
  }
  get nodes() {
    const uids = this.multiverse.graph.nodes();
    return uids.map((uid: string) => {
      return this.graph.node(uid);
    });
  }
  get edges() {
    const edgeIds = this.multiverse.graph.edges();
    return edgeIds.map((edgeId: { u: string; v: string }) => {
      return this.graph.edge(edgeId);
    });
  }

  computeEdgePath(points: { x: number; y: number }[]): string {
    let path = '';
    if (points.length > 2) {
      path += `M ${points[0].x} ${points[0].y}`;
      path += `L ${points[1].x} ${points[1].y}`;
      path += `L ${points[2].x} ${points[2].y}`;
    }
    return path;
  }
  /**
   * Debug the computed nodes and edges properties
   */
  debugNodes() {
    this.multiverse.graph.nodes().forEach((node: any) => {
      console.log(`Node ${node}: ${JSON.stringify(this.graph.node(node))}`);
    });
  }
  debugEdges() {
    this.edges.forEach((edge: any) => {
      console.log(`Edge ${edge}: ${JSON.stringify(edge)}`);
    });
  }
}
</script>

<style lang="scss" scoped>
.multiverse {
  border-top: 1px solid white;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  display: block;
  text-align: center;
  color: white;
  svg {
    min-height: 800px;
    width: 100%;
  }
  .node {
    font-size: 10px;
    &.past {
      fill: darkgrey;
      stroke: darkgrey;
    }
    &.present {
      fill: red;
      stroke: red;
      font-size: 10px;
    }
    &.future {
      fill: purple;
      stroke: purple;
    }

    rect {
      width: 20px;
      height: 20px;
    }
  }

  .edge {
    &.past {
      fill: darkgrey;
      stroke: darkgrey;
      & path {
        fill: darkgray;
      }
    }
    &.present {
      fill: red;
      stroke: red;
      font-size: 10px;
      & path {
        fill: red;
      }
    }
    &.future {
      fill: purple;
      stroke: purple;
      & path {
        fill: purple;
      }
    }
  }
}
</style>
