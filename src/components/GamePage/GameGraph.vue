<template>
  <div ref="multiverseWrapper" class="multiverse">
    <svg :style="computeSvgStyle">
      <!-- NODE -->
      <g :style="computeNodeStyle">
        <g v-for="(node, i) in nodes" :key="'node' + i" :class="computeNodeClass(node)">
          <circle :cx="node.x" :cy="node.y" r="5" @click="handleClick(node.fIndex)" />
          <!-- <text class="nodeText" :x="node.x" :y="node.y + 4" text-anchor="middle">{{ node.label }}</text> -->
          <path class="bar" :d="`M -500 ${node.y} L 500 ${node.y}`" />
        </g>

        <!-- EDGE -->
        <g v-for="(edge, i) in edges" :key="'edge' + i" :class="computeEdgeClass(edge)">
          <path :d="computeEdgePath(edge.points)" :stroke-width="1" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import MultiverseGraph from '@/engine/MultiverseGraph'
import { IStyle } from '@/types'

@Component({
  components: {},
})
export default class GameGraph extends Vue {
  @Prop() readonly multiverse!: MultiverseGraph
  @Prop() readonly activeFrame!: number
  $refs!: {
    multiverseWrapper: HTMLElement
  }

  rect = { width: 0, height: 0 }

  mounted(): void {
    this.rect = this.$refs.multiverseWrapper.getBoundingClientRect()
  }

  handleClick(frameId: number): void {
    this.$emit('change-frame', frameId)
  }

  get totalFrames(): number {
    return this.multiverse.simulation.frames.length
  }

  get computeSvgStyle(): IStyle {
    const { height } = this.graph.graph()
    return {
      height: `${height}px`,
      'max-height': '500px',
    }
  }

  get computeNodeStyle(): IStyle {
    const xCenterOffset = (this.rect.width - this.graph.graph().width) / 2
    return {
      transform: `translate(${xCenterOffset}px, 0px)`,
    }
  }

  // TODO: Node, edge and arrowhead are similar
  computeNodeClass(node: { fIndex: number; leaf: boolean; root: boolean }): string[] {
    let timeClass = ''
    if (node.fIndex < this.activeFrame) {
      timeClass = 'past'
    } else if (node.fIndex === this.activeFrame) {
      timeClass = 'present'
    } else {
      timeClass = 'future'
    }
    return ['node', timeClass, node.root ? 'root' : '', node.leaf ? 'leaf' : '']
  }

  computeEdgeClass(edge: { fIndex: number }): string[] {
    let timeClass = ''
    if (edge.fIndex < this.activeFrame) {
      timeClass = 'past'
    } else if (edge.fIndex === this.activeFrame) {
      timeClass = 'present'
    } else {
      timeClass = 'future'
    }
    return ['edge', timeClass]
  }

  /**
   * Getters
   */
  get graph(): MultiverseGraph['graph'] {
    return this.multiverse.graph
  }

  get nodes(): string[] {
    const uids = this.multiverse.graph.nodes()
    return uids.map((uid: string) => {
      return this.graph.node(uid)
    })
  }

  get edges(): { fIndex: number }[] {
    const edgeIds = this.multiverse.graph.edges()
    return edgeIds.map((edgeId: { u: string; v: string }) => {
      return this.graph.edge(edgeId)
    })
  }

  computeEdgePath(points: { x: number; y: number }[]): string {
    let path = ''
    if (points.length > 2) {
      path += `M ${points[0].x} ${points[0].y - 3}`
      // path += `L ${points[1].x} ${points[1].y}`
      path += `L ${points[2].x} ${points[2].y + 3}`
    }
    return path
  }

  /**
   * Debug the computed nodes and edges properties
   */
  debugNodes(): void {
    this.multiverse.graph.nodes().forEach((node: string) => {
      console.debug(`Node ${node}: ${JSON.stringify(this.graph.node(node))}`)
    })
  }

  debugEdges(): void {
    this.edges.forEach((edge) => {
      console.debug(`Edge ${edge}: ${JSON.stringify(edge)}`)
    })
  }
}
</script>

<style lang="scss" scoped>
$past: #ff0055;
$present: #ff0055;
$future: #5c00d3;
$root: #ff0055;
$leaf: #5c00d3;
.multiverse {
  border-top: 1px solid white;
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: block;
  text-align: center;
  color: white;
  padding-top: 20px;
  @media screen and (max-width: 1000px) {
    border-bottom: 1px solid white;
    min-height: 0px;
    margin-bottom: 64px;
    display: none;
  }
  svg {
    width: 100%;
    max-height: 500px;
  }
  .node {
    font-size: 10px;
    .bar {
      display: none;
      stroke-dasharray: 2 4;
    }
    &.past {
      fill: transparent;
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
      fill: transparent;
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
