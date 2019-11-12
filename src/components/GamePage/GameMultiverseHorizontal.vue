<template>
  <div ref="multiverseWrapper" class="multiverse">
    <!-- <h3>MULTIVERSE</h3> -->
    <svg :style="computedSvgStyle">
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
          <circle :cx="node.x" :cy="node.y" r="6" @mouseover="handleMouseOver(node.fIndex)" />
          <text class="nodeText" :x="node.x" :y="node.y + 4" text-anchor="middle">
            {{ node.label }}
          </text>
          <!-- <path class="bar" :d="`M ${node.x} 0 L ${node.x} 500`" /> -->
          <path class="bar" :d="`M -500 ${node.y} L 500 ${node.y}`" />
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
export default class GameMultiverseHorizontal extends Vue {
  @Prop() readonly multiverse!: MultiverseGraph;
  @Prop() readonly activeId!: number;
  $refs!: {
    multiverseWrapper: HTMLElement;
  };
  rect = { width: 0, height: 0 };

  mounted() {
    this.rect = this.$refs.multiverseWrapper.getBoundingClientRect();
  }

  handleMouseOver(activeId: number): void {
    this.$emit('changeActiveFrame', activeId);
  }

  get totalFrames() {
    return this.multiverse.qs.frames.length;
  }

  get computedSvgStyle(): {} {
    const { height } = this.graph.graph();
    return {
      height: `${height}px`,
      // 'min-height': this.totalFrames * 30,
      'max-height': '500px'
    };
  }

  computeNodeClass(node: { fIndex: number; leaf: boolean; root: boolean }): string[] {
    let timeClass = '';
    if (node.fIndex < this.activeId) {
      timeClass = 'past';
    } else if (node.fIndex === this.activeId) {
      timeClass = 'present';
    } else {
      timeClass = 'future';
    }
    return ['node', timeClass, node.root ? 'root' : '', node.leaf ? 'leaf' : ''];
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
    return {
      transform: `translate(${xCenterOffset}px, 0px)`
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
      // path += `L ${points[1].x} ${points[1].y}`;
      path += `L ${points[2].x} ${points[2].y}`;
    }
    return path;
  }
  /**
   * Debug the computed nodes and edges properties
   */
  debugNodes() {
    this.multiverse.graph.nodes().forEach((node: any) => {
      console.debug(`Node ${node}: ${JSON.stringify(this.graph.node(node))}`);
    });
  }
  debugEdges() {
    this.edges.forEach((edge: any) => {
      console.debug(`Edge ${edge}: ${JSON.stringify(edge)}`);
    });
  }
}
</script>

<style lang="scss" scoped>
$past: gray;
$present: red;
$future: purple;
$root: red;
$leaf: magenta;
.multiverse {
  border-top: 1px solid white;
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: block;
  text-align: center;
  color: white;
  svg {
    width: 100%;
    max-height: 500px;
  }
  .node {
    font-size: 10px;
    .bar {
      display: none;
    }
    &.past {
      fill: $past;
      stroke: $past;
    }
    &.present {
      fill: $present;
      stroke: $present;
      font-size: 10px;
      .bar {
        display: block;
      }
    }
    &.future {
      fill: $future;
      stroke: $future;
    }
    &.leaf {
      fill: $leaf;
      stroke: $leaf;
    }
    &.root {
      fill: $root;
      stroke: $root;
    }

    rect {
      width: 20px;
      height: 20px;
    }
  }

  .edge {
    &.past {
      fill: $past;
      stroke: $past;
      & path {
        fill: $past;
      }
    }
    &.present {
      fill: $present;
      stroke: $present;
      font-size: 10px;
      & path {
        fill: $present;
      }
    }
    &.future {
      fill: $future;
      stroke: $future;
      & path {
        fill: $future;
      }
    }
  }
}
</style>
