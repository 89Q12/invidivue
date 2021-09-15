<template>
	<div class="results">
		<div v-for="video in results" v-bind:key="video" class="vid">
			<div v-if="video.name">
				
				<div class="channelpicture">
					<a @click="gotochannel(video.id)">
				<img :src="video.thumbnails[video.thumbnails.length-1].url" :height="video.thumbnails[video.thumbnails.length-1].height" :width="video.thumbnails[video.thumbnails.length-1].width" />
				<p>{{ video.name }}</p>
				<p>{{ video.videoCount }} videos</p>
				<p>{{ video.subscriberCount }}Subscribers</p>
				
				</a>
				</div>
				
			</div>
			<div v-else>
			<a @click="watchWithId(video.id)">
			<div id="video">
				<div class="thumbnail">
				<img class="thumbnail" :src="video.thumbnails[0].url" :height="video.thumbnails[0].height" :width="video.thumbnails[0].width" />
				<p id="duration">{{ video.duration / 100 }} Min</p>
				</div>
				<p>{{ video.title }}</p>
				<p>{{ video.channel?video.channel.name:"" }}</p>
				<p>{{ video.uploadDate }} {{ video.viewCount / 1000 }}K</p>
			</div>
			</a>
			</div>
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
		
		//console.log(JSON.stringify(results.value));
		async function watchWithId(id: string) {
			await store.dispatch('get_current_video', id);
			localStorage.setItem('current_video', id);
			router.push({ path: 'video', query: { id: id }});
		}
		async function gotochannel(id: string) {
			await store.dispatch('get_channel', id);
			localStorage.setItem('current_channel', id);
			router.push({ path: 'channel', query: { id: id }});
		}
		return {
			results,
			watchWithId,
			gotochannel,
			router,
			store,
		};
	},
};
</script>
