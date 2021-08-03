<template>
	<Header />
	<router-view />
	<Footer />
</template>
<script lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
export default {
	name: 'App',

	components: {
		Header,
		Footer,
	},
};
</script>
<style lang="scss">
html,
body {
	font-family: 'Montserrat', 'Arial', 'Helvetica', sans-serif;
	min-height: 100vh;
	padding: 0%;
	margin: 0%;
	background-color: #232323;
	color: #a0a0a0;
}
div .center {
	height: 100%;
	margin-right: 25%;
	margin-left: 25%;
}
#app {
	margin-left: 5vw;
	margin-right: 5vw;
}
#duration{
	position: absolute;
	right: 0.25em;
	bottom: -0.5em;
	background-color: rgba(35, 35, 35, 0.75);
	color: #fff;
	border-radius: 2px;
	padding: 2px;
}
.vid{
	display: inline-block;
	//min-width: 25%;
	width: 280pt;
	height: 280pt;
}
#video{
	position: relative;
display: inline-block;
}
#video >img{
	width: 280pt;
	height: 180pt;
}
</style>
