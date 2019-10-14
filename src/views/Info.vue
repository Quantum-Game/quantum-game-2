<template>
	<main-layout>
		<div slot="left">
			<h3 class="upper-border">ALL ELEMENTS</h3>
		</div>
		<div slot="main">
			<router-view />
		</div>
		<div slot="right">
			<p class="upper-border">Related concepts</p>
		</div>
	</main-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MainLayout from '../layouts/MainLayout.vue';
import Entry from '../entries/Entry.vue';

interface ISection {
	title: string;
	content: string;
}

interface IEntry {
	title: string;
	short?: string;
	sections: Array<ISection>;
}

@Component({
	components: {
		MainLayout,
		Entry
	}
})
export default class Info extends Vue {}
</script>

<style lang="scss">
.upper-border {
	border-top: 1px solid white;
	padding: 1rem;
}
</style>
