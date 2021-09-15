<template>
	<header>
		<nav>
			<div class="start">
				<router-link to="/" class="menu-item-invidivue">INVIDIVUE</router-link>
			</div>
			<div class="menu-item-search">
				<input class="searchBar" v-model="searchParams" @keyup.enter="search()" placeholder="Search something" />
			</div>
			<div v-show="false">
				<router-link to="/" class="menu-item-top" @click="store.dispatch('logout')">Logout</router-link>
			</div>
			<div class="end">
				<router-link v-if="loggedIn=='false'" to="/signin" class="menu-item-top">Login</router-link>
				<router-link v-if="loggedIn=='true'" to="/profile" class="menu-item-top">{{username}}</router-link>
				
			</div>
		</nav>
	</header>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
		
		
export default {
	setup() {
		const searchParams = ref<string>('');
		const username = ref<string>('');
		const store = useStore();
		const router = useRouter();	
		const storeusername = localStorage.getItem('username');
		if (storeusername!=null){
			console.log(storeusername)
		username.value=storeusername;
		}
		store.subscribe((mutation, state) => {
			if(mutation.type == "set_search_query"){
				searchParams.value=mutation.payload;
			}
			if(mutation.type == 'set_username'){
				username.value=mutation.payload;
			}
		})
		async function search() {
			if (searchParams.value != '') {
				await store.dispatch('get_search_result', searchParams.value);
				router.push({ path: 'search', query: { query: searchParams.value } })
			}
		}
		const loggedIn= localStorage.getItem('loggedIn');
		
		return {
			searchParams,
			store,
			loggedIn,
			username,
			search,
		};
	},
	
};
</script>

<style lang="scss">
header {
	top: 0;
	width: 100%;
	height: 5em;
	z-index: 999;
	display: inline;
	.o-switch__label {
		color: #000000;
	}

	p {
		color: #000000;
	}
}

a {
	color: #ffffff;
	text-decoration: none;
}
.searchBar {
	background-color: #232323;
	padding: 10px;

	color: #ffffff;
	font-size: 100%;
	text-align: left;

	border: none;
	border-bottom: 1px solid;

	width: 100%;
}
.searchBar:focus {
	outline: none;
}

nav {
	height: 100%;
	display: flex;
	flex-flow: row wrap;
	align-items: center;
	justify-content: center;
}
nav div {
	width: 33.33%;
}
nav .end {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
nav .start {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}

nav .menu-item {
	padding: 10px 40px;
	text-align: center;
	border-bottom: 3px solid transparent;
}

nav .menu-item.active,
nav .menu-item:hover {
	background-color: rgb(0, 0, 0);
	border-block-color: #e1cc81;
}

nav .menu-item a {
	color: inherit;
	text-decoration: none;
}

nav .menu-item-top {
	position: relative;
	text-align: center;
	border-bottom: 3px solid transparent;
}
nav .menu-item-search {
	position: relative;
	text-align: center;
	border-bottom: 3px solid transparent;
}
nav .menu-item-invidivue {
	padding: 10px;
	position: relative;
	text-align: center;
	font-weight: bold;
}

nav .menu-item-top.active,
nav .menu-item-top:hover {
	background-color: #000000;
}

nav .menu-item-top a {
	color: inherit;
	text-decoration: none;
}
@media screen and (max-width: 650px) {
	nav {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
	}
	nav .menu-item-top {
		color: blue($color: #000000);
		position: relative;
		text-align: center;
	}
	nav .menu-item-search {
		color: blue($color: #000000);
		padding: 10px;
		position: relative;
		text-align: center;
		border-bottom: 3px solid transparent;
		width: 100%;
	}
	nav .end {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	nav .start {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
}
</style>
