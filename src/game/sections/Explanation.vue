<template>
  <div class="explanation" v-if="name">
    <h3 class="title">{{ name }}</h3>
    <p>{{ desc }}</p>
    <router-link :to="url">
      <a>LEARN MORE</a>
      <!-- <a>LEARN MORE about {{ name }} >> </a> -->
    </router-link>
    <!-- <slot></slot> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Cell } from 'quantumweasel';
//import QButton from '@/components/QButton.vue';
import bus from '@/eventbus';

@Component({
  components: {
    //QButton
  }
})
export default class Explanation extends Vue {
  desc = '';
  name = '';

  created() {
    bus.$on('setActiveElement', (cell: Cell) => {
      this.desc = cell.element.description;
      this.name = cell.element.name;
    });
  }
  get url() {
    return `/info/${this.name}`;
  }
}
</script>

<style lang="scss" scoped>
.explanation {
  border-top: 1px solid #8e819d;
  text-align: left;
  font-size: 1rem;
  line-height: 150%;
	max-width: 250px;
}

a {
  color: #837e9b;
  font-size: 0.8rem;
  //text-decoration: none;
}
</style>
