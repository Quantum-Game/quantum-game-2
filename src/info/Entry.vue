<template>
	<div v-if="entry" class="entry">
		<router-link to="/info">
			<q-button type="basic">ENCYCLOPEDIA</q-button>
		</router-link>
		<article>
			<h1 class="title">{{ entry.title.toUpperCase() }}</h1>
			<h2 class="short">{{ entry.short }}</h2>

			<div class="boards">
				<div v-for="(level, i) in levels" :key="'level' + i">
					<Egrid :level="level.level" :step="level.step" class="board" />
				</div>
			</div>

			<entry-section
				v-for="(section, index) in entry.sections"
				:key="section.title"
				:section="section"
				:should-be-open-on-init="index === 0"
			/>

			<EquationGrid :element-name="entry.elementName" rotation="45" step="3" />
		</article>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { Level, Level, GridInterface } from 'quantumweasel';
import EntrySection, { ISection } from './EntrySection.vue';
import Photon from '../game/Photon.vue';
import QButton from '../components/QButton.vue';
import { getEntry } from './entries';

import Egrid from '../game/sections/EGrid.vue';
import EquationGrid from './EquationGrid.vue';

interface IEntryList {
	[index: string]: IEntry;
}

interface IEntry {
	title: string;
	elementName: string;
	short?: string;
	grids: Array<GridInterface>;
	sections: Array<ISection>;
}

@Component({
	components: {
		EntrySection,
		Egrid,
		QButton,
		Photon,
		EquationGrid
	}
})

// XXX this thing produces an error - by definition, not even execution
// const expandGridToLevel = (grid: GridInterface): Level => Level.importLevel({
//   id: 1345,
//   name: "sdf",
//   group: "sg",
//   description: "sdgsd",
//   grid: grid,
//   hints: [],
//   goals: []
// })
export default class Entry extends Vue {
	entry: IEntry = {
		title: '',
		elementName: 'Mirror', // XXX suck at reloading, vide router and params
		grids: [],
		sections: []
	};

	get levels(): { level: Level; step: number }[] {
		return this.entry.grids.map((grid) => {
			const level = Level.importLevel({
				id: -1,
				name: '',
				group: '',
				description: '',
				grid,
				hints: [],
				goals: []
			});
			return { level, step: 3 };
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

.placeholder {
	padding-top: 2rem;
	width: 100%;
	border-bottom: 1px solid #8e819d;
	& .board {
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
