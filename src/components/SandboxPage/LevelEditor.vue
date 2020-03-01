<template>
  <div>
    <h1>Level editor</h1>
    <div id="form">
      <!-- ID SHOULD BE DYNAMIC -->
      <table class="table">
        <!-- NAME -->
        <tr>
          <td class="label">
            Name
          </td>
          <td class="input">
            <input v-model="level.name" placeholder="Name" />
          </td>
        </tr>

        <!-- DESCRIPTION -->
        <tr>
          <td class="label">
            Description
          </td>
          <td class="input">
            <textarea v-model="level.description" placeholder="Description" />
          </td>
        </tr>

        <!-- GROUP -->
        <tr>
          <td class="label">
            Group
          </td>
          <td class="input">
            <div class="select">
              <select v-model="level.group">
                <option
                  v-for="element in Object.values(Group)"
                  :key="element"
                  :value="element"
                  :selected="element === 'Sandbox' ? true : false"
                >
                  {{ element }}
                </option>
              </select>
            </div>
          </td>
        </tr>
      </table>

      <!-- DISPLAY JSON OUTPUT -->
      <div class="jsonLevel">
        {{ level.exportLevel() }}
      </div>
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
      width: 300px;
    }
  }
  .jsonLevel {
    font-size: 10px;
  }
}
</style>
