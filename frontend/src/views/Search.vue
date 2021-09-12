<template>
	<div class="results">
		<div v-for="video in results" v-bind:key="video" class="vid">
			<a @click="watchWithId(video.id)">
			<div id="video">
				<div class="thumbnail">
				<img :src="video.thumbnails[0].url" :height="video.thumbnails[0].height" :width="video.thumbnails[0].width" />
				<p id="duration">{{ video.duration / 100 }} Min</p>
				</div>
				<p>{{ video.title }}</p>
				<p>{{ video.channel?video.channel.name:"" }}</p>
				<p>{{ video.uploadDate }} {{ video.viewCount / 1000 }}K</p>
			</div>
			</a>
		</div>
	</div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Header from '../components/Header.vue';
export default {
	
	setup() {
		const store = useStore();
		const router = useRouter();
		const results = computed(() => store.state.video_store_module.search_results);
		
		if(router.currentRoute.value.query.query){
			console.log(router.currentRoute.value.query.query);
			store.dispatch('get_search_result', router.currentRoute.value.query.query);
		}
		
		//
		
		async function watchWithId(id: string) {
			await store.dispatch('get_current_video', id);
			localStorage.setItem('current_video', id);
			router.push('video');
		}
		
		return {
			results,
			watchWithId,
			router,
			store,
		};
	},
};
</script>
