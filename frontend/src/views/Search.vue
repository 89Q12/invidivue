<template>
	<div class="results">
		<div v-for="video in results" v-bind:key="video" class="vid">
			<a @click="watchWithId(video.id)">
				<div id="video">
				<img :src="video.thumbnails[0].url" :height="video.thumbnails[0].height" :width="video.thumbnails[0].width" />
				<p id="duration">{{ video.duration / 100 }} Min</p>
				</div>
			<p>{{ video.title }}</p>
			<p>{{ video.channel?video.channel.name:"" }}</p>
			<p>{{ video.uploadDate }} {{ video.viewCount / 1000 }}K</p>
			</a>
		</div>
	</div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
	setup() {
		const store = useStore();
		const router = useRouter();
		const results = computed(() => store.state.video_store_module.search_results);
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
