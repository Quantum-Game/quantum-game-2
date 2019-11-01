<template>
	<div v-if="entry" class="entry">
		<router-link to="/info">
			<q-button type="basic">ENCYCLOPEDIA</q-button>
		</router-link>
		<article>
			<!-- TITLE -->
			<h1 class="title">{{ entry.title.toUpperCase() }}</h1>
			<h2 class="short">{{ entry.short }}</h2>

			<!-- GRIDS -->
			<div class="grids">
				<div v-for="(level, i) in levels" :key="'level' + i">
					<encyclopedia-board :level="level.levelInst" :step="level.step" class="grid" />
				</div>
			</div>

			<!-- SECTIONS -->
			<encyclopedia-article-section
				v-for="(section, index) in entry.sections"
				:key="section.title"
				:section="section"
				:should-be-open-on-init="index === 0"
			/>

			<!-- EQUATION GRID -->
			<encyclopedia-operator-viewer :element-name="entry.elementName" :rotation="entry.defaultRotation" step="3" />
		</article>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { GridInterface, EntryListInterface, EntryInterface } from '@/engine/interfaces';
import { Level } from '@/engine/classes';
import { getEntry } from '@/assets/data/entries/index';
import AppButton from '@/components/AppButton.vue';
import EncyclopediaArticleSection from '@/components/EncyclopediaPage/EncyclopediaArticleSection.vue';
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue';
import EncyclopediaMatrix from '@/components/EncyclopediaPage/EncyclopediaMatrix.vue';

@Component({
	components: {
		AppButton,
		EncyclopediaArticleSection,
		EncyclopediaBoard,
		EncyclopediaMatrix
	}
})
export default class EncyclopediaArticle extends Vue {
	entry: EntryInterface = {
		title: '',
		elementName: 'Mirror',
		grids: [],
		sections: []
	};

	get levels(): { levelInst: Level; step: number }[] {
		return this.entry.grids.map((grid) => {
			const levelInst = Level.importLevel({
				id: -1,
				name: '',
				group: '',
				description: '',
				grid,
				hints: [],
				goals: []
			});
			return { levelInst, step: 3 };
		});
	}

	created() {
		this.loadEntry();
	}

	// XXX Are we really sure we want to use watch in route, and not - pass in router via params?
	@Watch('$route')
	loadEntry() {
		if (this.entryURL) {
			this.entry = getEntry(this.entryURL);
		}
		if (!this.entry.title) {
			this.$router.push({ name: '404' });
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
	align-items: center;
	& .title {
		font-size: 2rem;
		font-weight: bold;
	}
	& .short {
		font-size: 1rem;
		padding-right: 20%;
		padding-left: 20%;
		padding-bottom: 20px;
	}
	& .go-back {
		font-weight: bold;
		text-decoration: none;
		color: white;
	}
	& p {
		line-height: 2em;
		text-align: left;
	}
}

h1 {
	padding-bottom: 1rem;
	border-bottom: 1px solid white;
	text-align: center;
}
.grids {
	display: flex;
	justify-content: space-around;
	width: 100%;
	border-bottom: 1px solid #8e819d;
}
.placeholder {
	padding-top: 2rem;
	width: 100%;
	border-bottom: 1px solid #8e819d;
	& .grid {
		width: 100%;
		margin: 0 auto 0rem;
		height: 200px;
		text-align: center;
		padding-bottom: 4rem;
		& span {
			font-size: 1rem;
			color: gold;
		}
	}
}
</style>
