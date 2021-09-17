<template>
	<header class="mx-auto mt-auto">
		<div class="navbar row">
			<div class="col-4">
				<router-link to="/" class="fw-bold">INVIDIVUE</router-link>
			</div>
			<div class="col-4">
				<input class="searchBar" v-model="searchParams" @keyup.enter="search()" placeholder="Search something" />
			</div>
			<div class="col-4 d-flex justify-content-end">
				<router-link v-if="!loggedIn" to="/signin">Login</router-link>
				<router-link v-else to="/" class="menu-item-top" @click="store.dispatch('logout')">Logout</router-link>
			</div>
		</div>
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
				store.dispatch('get_search_result', searchParams.value);
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
@media screen and (max-width: 650px) {
}
</style>
