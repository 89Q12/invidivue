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
.outline-none{
	outline: none !important;
}
.form {
	margin-top: 2.5em;
	color: #ffffff;
	word-wrap: break-word;
    width: 50%;
}

.form {
	border: none;
}
.form button {
	font-size: 100%;
	margin-top: 0.5em;
	padding: 0.5em 1em;
	background-color: #a0a0a0;
	box-shadow: none;
	border: none;
	border-radius: 4px;
	cursor: pointer;
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
	padding: 5pt;
	//border:1px solid white;
}
#video{
	
	display: table;
}
.thumbnail{
	display: inline-block;
	position: relative;
}
.channelpicture{
	display: table;
	width: 100%;
}
img.thumbnail{
	width: 280pt;
	height: 180pt;
}
video {
	width: -moz-available;
	width: -webkit-fill-available;
}
.videoInfo{
	//height: 500pt; switch with js to hide info
overflow: hidden;
}

.error{
	color:lightcoral;
}
</style>
