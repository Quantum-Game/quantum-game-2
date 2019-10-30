<template>
	<main-layout>
		<article slot="main" class="main">
			<ul class="main__level-list">
				<li v-for="(stuff, i) in Array(34)" :key="i">
					<router-link class="levelLink" :to="`/level/${i + 1}`">Level {{ i + 1 }}</router-link>
				</li>
			</ul>
		</article>
	</main-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MainLayout from '@/layouts/MainLayout.vue';

@Component({
	components: {
		MainLayout
	}
})
export default class Levels extends Vue {

};
</script>

<style lang="scss">
.main {
	padding: 10em;
	& .main__level-list {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 0;
		margin: 0;
		list-style: none;
		& a {
			color: white;
		}
	}
}
</style>