<template>
	<div class="row ">
		<div v-for="video in results" v-bind:key="video" class="col-3">
			<div v-if="video.name">
				<DisplayChannelCard :video="video"/>
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
import DisplayChannelCard from '../components/DisplayChannelCard.vue';
import VideoCard from '../components/DisplayVideoCard.vue';
export default {
	components: {
		DisplayChannelCard,
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
