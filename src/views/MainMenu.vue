<template>
	<div class="home-page-wrapper">
	<div class="row-full">
		<img src="@/assets/QG_logo.svg" alt="QuantumGame">
	</div>
	<router-link to="/info" > <q-button  type="special"> PLAY </q-button> </router-link>
	<br />
	<div class="hello">
		<h1>A puzzle game with photons, superposition and quantum measurement, right in your browser. With true quantum mechanics underneath!</h1>
		<h1>Visit us on <a href="https://twitter.com/quantumgameio" target="_blank">Twitter</a>, <a href="https://www.facebook.com/quantumgameio/" target="_blank">Facebook</a>, <a href="https://github.com/stared/quantum-game" target="_blank">Github</a> and <a href="https://medium.com/quantum-photons" target="_blank">Medium</a>.</h1>
		<div class="image">
			<img src="@/assets/rock.svg" alt="rock" />
		</div>
		<div class="blog">
			blog blog
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

<style scoped lang="scss">
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
	text-decoration:none;
}
</style>
