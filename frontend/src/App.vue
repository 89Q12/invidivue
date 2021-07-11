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
</style>
