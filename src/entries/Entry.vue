<template>
	<div class="entry">
		<router-link to="/info" class="go-back"> BACK TO GAME </router-link>
		<article>
			<h1 class="title">{{ entry.title.toUpperCase() }}</h1>
			<h2 class="short">{{ entry.short }}</h2>
			<div class="placeholder">
				<div class="board">
					<span>placeholder </span>
				</div>
			</div>
			<entry-section
				v-for="(section, index) in entry.sections"
				:key="section.title"
				:section="section"
				:should-be-open-on-init="index === 1"
			/>
		</article>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import EntrySection, { ISection } from './EntrySection.vue';
import entries from './entries.json';

interface IEntryList {
	[index: string]: IEntry;
}

interface IEntry {
	title: string;
	short?: string;
	sections: Array<ISection>;
}

@Component({
	components: {
		EntrySection
	}
})
export default class Entry extends Vue {
	entry: IEntry = {
		title: '',
		sections: []
	};

	created() {
		this.loadEntry();
	}

	@Watch('$route')
	loadEntry() {
		const typedEntries: IEntryList = entries;
		if (this.entryURL) {
			this.entry = typedEntries[this.entryURL];
		}
	}

	get entryURL(): string {
		return this.$route.params.entry;
	}
}
</script>

<style lang="scss" scoped>
.entry {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	& .title {
		font-size: 2rem;
		font-weight: bold;
	}
	& .short {
		font-size: 1.1rem;
	}
	& .go-back {
		font-weight: bold;
		text-decoration: none;
		color: white;
	}
}
h1 {
	padding-bottom: 1rem;
	border-bottom: 1px solid white;
	text-align: center;
}

.placeholder {
	width: 100%;
	border-bottom: 1px solid #8e819d;
	& .board {
		width: 90%;
		margin: 0 auto 1rem;
		height: 200px;
		text-align: center;
		& span {
			font-size: 1rem;
			color: gold;
		}
	}
}
</style>
