<template>
	<header class="mx-auto mt-auto">
		<div class="navbar row">
			<div class="col-xl-4">
				<router-link to="/" class="fw-bold">INVIDIVUE</router-link>
			</div>
			<div class="col-xl-4">
				<input class="searchBar" v-model="searchParams" @keyup.enter="search()" placeholder="Search something" />
			</div>
			<div class="col-2"></div>
			<div class="col-xl-2 d-flex justify-content-between">
				<router-link to="/profile">{{ store.state.user_store_module.user.username }}</router-link>
				<router-link v-if="!store.state.user_store_module.user.isAuthenticated" to="/signin">Login</router-link>
				<router-link v-else to="/" class="menu-item-top" @click="store.dispatch('logout')">Logout</router-link>
			</div>
		</div>
	</header>
</template>

<script lang="ts">
import { ref,computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
		
		
export default {
	setup() {
		const searchParams = ref<string>('');
		const username = ref<string>('');
		const store = useStore();
		const router = useRouter();	

		store.subscribe((mutation, state) => {
			if(mutation.type == "set_search_query"){
				searchParams.value=mutation.payload;
			}
		})
		async function search() {
			if (searchParams.value != '') {
				store.dispatch('get_search_result', searchParams.value);
				router.push({ path: 'search', query: { query: searchParams.value } })
			}
		}		
		return {
			searchParams,
			store,
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
</style>
