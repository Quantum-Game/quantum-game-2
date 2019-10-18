<template>
	<div class="home-page-wrapper">
		<div class="row-full">
			<img src="@/assets/QG_logo.svg" alt="QuantumGame" />
		</div>
		<router-link to="/info"> <q-button type="special"> PLAY </q-button> </router-link>
		<br />
		<div class="hello">
			<h1>
				A puzzle game with photons, superposition and quantum measurement, right in your browser. With true quantum
				mechanics underneath!
			</h1>
			<h1>Visit us on Twitter, Facebook, Github and Medium.</h1>
		</div>
		<div class="image">
			<img src="@/assets/rock.svg" alt="rock" />
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import QButton from '../components/QButton.vue';

@Component({
	components: {
		QButton
	}
})
export default class MainMenu extends Vue {}
</script>

<style scoped lang="scss">
.home-page-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}
h1 {
	color: white;
	font-size: 1.5rem;
	font-weight: normal;
	line-height: 150%;
}
.hello {
	width: 40%;
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
	width: 10%;
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
	color: #42b983;
	text-decoration: none;
}
</style>
