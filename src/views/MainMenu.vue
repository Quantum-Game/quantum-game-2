<template>
	<div class="home-page-wrapper">
		<div class="row-full">
			<img src="@/assets/QG_logo.svg" alt="QuantumGame" />
		</div>
		<router-link to="/level/1"> <q-button type="big"> PLAY </q-button> </router-link>
		<br />
		<div class="hello">
			<h1>
				A puzzle game with photons, superposition and quantum measurement, right in your browser. With true quantum
				mechanics underneath!
			</h1>
			<h1>
				Visit us on <a href="https://twitter.com/quantumgameio" target="_blank">Twitter</a>,
				<a href="https://www.facebook.com/quantumgameio/" target="_blank">Facebook</a>,
				<a href="https://github.com/stared/quantum-game" target="_blank">Github</a> and
				<a href="https://medium.com/quantum-photons" target="_blank">Medium</a>.
			</h1>
			<div class="image">
				<img src="@/assets/rock.svg" alt="rock" />
			</div>
			<div class="blog">
				<h2>Wave optics and quantum mechanics as a game</h2>
				<p>
					NEWS: We develop Quantum Game v 2.0 at CQT, Singapore. See updates at Medium or Twitter. We will release it late
					2019. for fun! Learn quantum mechanics as a side effect. It’s a puzzle game, heavily inspired by The Incredible
					Machine and Chromatron. All you need is a browser (we recommend recent version of Firefox or Chrome), you don’t
					need to install anything. It’s open source - so not only you can play it for free, but also lookup the code.
					Motivation behind the game is in Quantum mechanics for high-school students blog post. It was covered on The
					Quantum Times (top pick in education for gamifying quantum theory), Motherboard, Scott Aaronson, Cory Doctorow,
					Hacker News (actually, twice). For more games like this one, see: Science-based games collaborative list.
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Resource from '../components/Resource.vue';
import QButton from '../components/QButton.vue';

@Component({
	components: {
		QButton,
		Resource
	}
})
export default class MainMenu extends Vue {}
</script>

<style lang="scss" scoped>
.home-page-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #2e006a;
}
h1 {
	color: white;
	font-size: 1.5rem;
	font-weight: normal;
	line-height: 150%;
}
h2 {
	margin-top: 20px;
	color: white;
	font-size: 1rem;
	font-weight: bold;
	line-height: 150%;
	text-transform: uppercase;
}
.hello {
	width: 35%;
	display: flex;
	position: center;
	flex-direction: column;
	align-items: center;
}
.row-full {
	width: 100vw;
	min-width: 1200px;
	position: center;
	//  margin-left: -50vw;
	height: 100px;
	margin-top: 100px;
	margin-bottom: 12vw;
	//left: 50%;
	align-items: center;
}
.image {
	width: 30%;
}
.blog {
	border-top: 1px solid white;
	color: white;
	font-size: 1rem;
	font-weight: normal;
	line-height: 150%;
}

h3 {
	// margin: 40px 0 0;
	color: white;
	text-align: left;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #9780b5;
	text-decoration: none;
}
</style>
