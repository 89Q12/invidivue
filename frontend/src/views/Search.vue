<template>
	<div class="row mx-auto">
		<div class="col-12 mt-4"></div>
		<div v-for="video in results" v-bind:key="video" class="col-sm-3">
			<div v-if="video.name">
				<PlaylistCard :video="video"/>
			</div>
			<div v-else>
				<VideoCard :video="video"/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import PlaylistCard from '../components/DisplayChannelCard.vue';
import VideoCard from '../components/DisplayVideoCard.vue';
export default {
	    components: {
		PlaylistCard,
		VideoCard,
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const results = computed(() => store.state.video_store_module.search_results);
		
		if(router.currentRoute.value.query.query){
			console.log(router.currentRoute.value.query.query);
			store.dispatch('get_search_result', router.currentRoute.value.query.query);
		}

		return {
			results,
			router,
			store,
		};
	},
};
</script>
