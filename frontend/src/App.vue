<template>
	<div class="col-1"></div>
	<div class="col-10">
		<Header />
		<router-view />
		<Footer />
	</div>
	<div class="col-1"></div>
</template>
<script lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { onMounted } from 'vue';
import { useStore } from 'vuex';
export default {
	name: 'App',
	components: {
		Header,
		Footer,
	},
	setup() {
		const store = useStore();
		onMounted(() => {
			store.dispatch('getloggedInUser');
		});
		return {};
	},
};
</script>
<style lang="scss">
html,
body {
	font-family: 'Montserrat', 'Arial', 'Helvetica', sans-serif;
	background-color: #232323;
	color: #a0a0a0;
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
	width: 100%;
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
	width: 100%;
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
