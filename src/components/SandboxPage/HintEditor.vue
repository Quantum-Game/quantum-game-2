<template>
  <div>
    <h1>Hint editor</h1>
    <div id="form">
      <!-- ID SHOULD BE DYNAMIC -->
      <table class="table">
        <!-- NAME -->
        <tr v-for="(hint, index) in level.hints" :key="'hint' + index">
          <td class="coord">
            {{ hint.coord }}
          </td>
          <td class="message">
            <input v-model="hint.message" placeholder="Message" />
          </td>
          <td class="type">
            <select v-model="hint.type">
              <option
                v-for="element in ['purple', 'red']"
                :key="element"
                :value="element"
                :selected="element === 'red' ? true : false"
              >
                {{ element }}
              </option>
            </select>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Elem, Group } from '@/engine/interfaces'
import Level from '@/engine/Level'

@Component({
  components: {}
})
export default class LevelEditor extends Vue {
  @Prop() readonly level!: Level
  Elem = Elem
  Group = Group

  deleteHint(id: number): void {
    this.level.hints = this.level.hints.splice(id, id)
  }
}
</script>

<style lang="scss" scoped>
.small {
  font-size: 10px;
}
.table {
  width: 100%;
  td {
    padding: 10px;
    &.label {
      text-align: right;
      width: 30%;
    }
    &.input {
      text-align: left;
      width: 70%;
    }
    textarea {
      width: 200px;
    }
  }
}
</style>
