<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style lang="scss">
body {
	margin: 0;
	padding: 0;
	box-sizing: content-box;
	overflow-x: hidden;
}
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	padding: 0;
	width: 100%;
	height: 100%;
	min-height: 100vh;
	// min-width: 100vw;
	// overflow-y: hidden;
	background: #5000a0; /* Old browsers */
	background: -moz-radial-gradient(center, ellipse cover, #5000a0 0%, #3c1156 100%); /* FF3.6-15 */
	background: -webkit-radial-gradient(center, ellipse cover, #5000a0 0%, #3c1156 100%); /* Chrome10-25,Safari5.1-6 */
	background: radial-gradient(
		ellipse at center,
		#5000a0 0%,
		#3c1156 100%
	); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#5000a0', endColorstr='#3c1156',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
}
#nav {
	padding: 30px;
	a {
		font-weight: bold;
		color: #2c3e50;
		&.router-link-exact-active {
			color: #796bbc;
		}
	}
}
</style>
