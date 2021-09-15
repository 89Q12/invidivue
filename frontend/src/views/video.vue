<template>
	<div class="video">
		<div v-if="video" class="player">
			<video :src="video.formats[0].url" controls autoplay></video>
		</div>
		<div class="videoInfo">
			<p>{{ video.videoDetails.title }}</p>
			<p>{{ video.videoDetails.author.name }}| {{ video.videoDetails.author.subscriber_count / 1000 }}K</p>
			<p>Uploaded: {{ video.videoDetails.uploadDate }}</p>
			<p>Views: {{ video.videoDetails.viewCount / 1000 }}K</p>
			<p>Likes: {{ video.videoDetails.likes / 1000 }}K</p>
			<p>dislikes: {{ video.videoDetails.dislikes / 1000 }}K</p>
			<p style="white-space: pre-line;">{{ video.videoDetails.description }}</p>
		</div>
		<div v-for="vid in video.related_videos" v-bind:key="vid" class="related">
			<a @click="watchWithId(vid.id)"
				><img :src="vid.thumbnails[0].url" :height="vid.thumbnails[0].height" :width="vid.thumbnails[0].width" />
				{{ vid.length_seconds / 100 }} Min</a
			>
			<p>{{ vid.title }}</p>
			<p>{{ vid.author.name }}</p>
			<p>Uploaded: {{ vid.published }} views: {{ vid.view_count / 1000 }}K</p>
		</div>
	</div>
</template>
<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
	setup() {
		const store = useStore();
		const router = useRouter();
		if(router.currentRoute.value.query.id){
			store.dispatch('get_current_video', router.currentRoute.value.query.id);
		}
		onMounted(() => {
			console.log(localStorage.getItem('current_video'));
			if (localStorage.getItem('current_video')) {
				store.dispatch('get_current_video', localStorage.getItem('current_video'));
			}
		});
		const video = computed(() => store.state.video_store_module.current_video);
		async function watchWithId(id: string) {
			await store.dispatch('get_current_video', id);
			localStorage.setItem('current_video', id);
			router.push('video');
		}
		return {
			video,
			router,
			watchWithId,
			store,
		};
	},
};
</script>
