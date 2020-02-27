<template>
  <div>
    <h1>Level Editor</h1>
    <div id="form">
      <!-- ID SHOULD BE DYNAMIC -->
      <!-- NAME -->
      <p>
        Name:
        <input v-model="level.name" placeholder="Name" />
      </p>
      <!-- DESCRIPTION -->
      <p>
        Description:
        <textarea v-model="level.description" placeholder="Description" />
      </p>
      <!-- SIZE -->
      <p>
        Size:
        <input v-model="level.grid.cols" placeholder="Columns" />x
        <input v-model="level.grid.rows" placeholder="Rows" />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Elem } from '@/engine/interfaces'
import Level from '@/engine/Level'

@Component({
  components: {}
})
export default class LevelEditor extends Vue {
  @Prop() readonly level!: Level
  Elem = Elem
}
</script>

<style lang="scss" scoped>
.small {
  font-size: 10px;
}
</style>
