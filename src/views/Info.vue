<template>
	<main-layout>
		<div slot="left" class="element-list">
			<h3 class="upper-border">ALL ELEMENTS</h3>
			<router-link v-for="entry in entryList" :key="entry" :to="`/info/${entry}`">
				<div>{{ entry }}</div>
			</router-link>
		</div>
		<div slot="main">
			<router-view />
		</div>
		<div slot="right">
			<h3 class="upper-border">RELATED CONCEPTS</h3>
			<!-- <Absorber /> -->
		</div>
	</main-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MainLayout from '../layouts/MainLayout.vue';
import Entry from '../info/Entry.vue';
import { entriesNameList } from '../info/entries';
import Absorber from '../game/pieces/Absorber.vue';

interface ISection {
	title: string;
	content: Array<string>;
}

interface IEntry {
	title: string;
	short?: string;
	sections: Array<ISection>;
}

@Component({
	components: {
		MainLayout,
		Entry,
		Absorber
	}
})
export default class Info extends Vue {
	entryList: Array<string> = [];
	created() {
		entriesNameList.forEach((entryName: string) => this.entryList.push(entryName));
	}
}
</script>

<style lang="scss" scoped>
.upper-border {
	border-top: 1px solid white;
	padding-top: 1rem;
	padding-bottom: 1rem;
	text-align: left;
	color: white;
	text-decoration: none;
}

.element-list {
	a {
		color: white;
		text-decoration: none;
		line-height: 200%;
	}
}
</style>
