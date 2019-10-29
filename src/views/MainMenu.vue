<template>
	<div class="home-page-wrapper">
		<div class="row-full">
			<img src="@/assets/QG_logo.svg" alt="QuantumGame" />
		</div>
		<router-link to="/level/1"> <q-button type="big"> PLAY </q-button> </router-link>
		<br />
		<div class="hello">
			<h1>
				A puzzle game with photons, superposition and quantum measurement, right in your browser.
				With true quantum mechanics underneath! <br>

			</h1>
			<h1>
				Visit us on <a href="https://twitter.com/quantumgameio" target="_blank">Twitter</a>,
				<a href="https://www.facebook.com/quantumgameio/" target="_blank">Facebook</a>,
				<a href="https://github.com/stared/quantum-game-2" target="_blank">Github</a> and
				<a href="https://medium.com/quantum-photons" target="_blank">Medium</a>.
			</h1>
			<p>	This version of the game was funded by the <a href="https://www.quantumlah.org/" target="_blank">Center for Quantum Technologies</a>
					of the National University of Singapore.
			</p>
			<img src="@/assets/CQT_NUS_Logo_mono.svg" alt="CQT logo" class="CQTlogo"/>
			<!-- newsletter -->
			<!-- <div id="content" class="newsletter">
				<h1>Sign up for our newsletter now!</h1>
				<input type="email" placeholder="Email" />
				<q-button type="special" href="#">SIGN UP</q-button>
			</div> -->

			<div class="image">
				<img src="@/assets/rock.svg" alt="rock" />
			</div>
			<!-- <div class="blog">
				<h2>Wave optics and quantum mechanics as a game</h2>
				<p>
					NEWS: We develop Quantum Game v 2.0 at CQT, Singapore. See updates at Medium or Twitter.
					We will release it late 2019. for fun! Learn quantum mechanics as a side effect. It’s a
					puzzle game, heavily inspired by The Incredible Machine and Chromatron. All you need is a
					browser (we recommend recent version of Firefox or Chrome), you don’t need to install
					anything. It’s open source - so not only you can play it for free, but also lookup the
					code. Motivation behind the game is in Quantum mechanics for high-school students blog
					post. It was covered on The Quantum Times (top pick in education for gamifying quantum
					theory), Motherboard, Scott Aaronson, Cory Doctorow, Hacker News (actually, twice). For
					more games like this one, see: Science-based games collaborative list.
				</p>
			</div> -->

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

<style lang="scss" scoped>
.home-page-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: linear-gradient(#5c00d3, #ff0055, #fbb03b);
	//background-color: #2e006a;
	// background-image: url(~../assets/background_dots.svg);
	// background-size: 1000px auto; //not responsive
	// background-repeat: repeat;
	// background-position: center;
}
h1 {
	color: white;
	font-size: 1.4rem;
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
p {
	color: white;
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
	min-width: 1300px;
	position: center;
	//  margin-left: -50vw;
	height: 100px;
	margin-top: 100px;
	margin-bottom: 12vw;
	//left: 50%;
	align-items: center;
}
.image {
	width: 40%;
	padding-bottom: 10px;
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
	color: rgb(255, 181, 209);
	//color:ffcfe5;
	//color: #9780b5;
	text-decoration: none;
}
a:hover{
		color: white;
}

.CQTlogo {
	max-width: 250px;
}
///////////
* {
	transition: all 0.6s;
}
// .newsletter{
// 	padding-bottom:30px;
// }
input[type='email'] {
	outline: none;
	display: inline-block;
	width: 60%;
	padding: 10px;
	background: none;
	border-top: none;
	border-right: none;
	border-left: none;
	border-bottom: 1px solid white;
	box-sizing: border-box;
	color: white;
	font-size: 1rem;
	font-weight: normal;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	-o-box-sizing: border-box;
	-ms-box-sizing: border-box;
	margin-right: 20px;
}

input[type='email']:focus {
	color: white;
	font-family: Montserrat, Arial, Helvetica, sans-serif;
	font-size: 1rem;
	font-weight: normal;
	border-top: none;
	border-right: none;
	border-left: none;
	border-bottom: 1px solid white;
}

::placeholder {
	color: white;
	font-family: Montserrat, Arial, Helvetica, sans-serif;
}

@media screen and (max-width: 736px) {
	input[type='email'] {
		color: white;
		font-size: 1rem;
		font-weight: normal;
		display: block;
		width: 100%;
	}
}
////////////
</style>
