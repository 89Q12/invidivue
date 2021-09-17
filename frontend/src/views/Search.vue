<template>
	<div class="row mx-auto">
		<div class="col-12 mt-4"></div>
		<div v-for="video in results" v-bind:key="video" class="col-sm-4">
			<div v-if="video.name">
				<div class="channelpicture">
					<div class="d-flex justify-content-center">
						<img class="img-thumbnail w-50" :src="video.thumbnails[0].url" />
						
					</div>
					<p><SubscribeButton :cid="video.id" /></p>
						<a @click="gotochannel(video.id)" ><p>{{ video.name }}</p></a>
						<p>{{ video.videoCount }} videos</p>
						<p>{{ video.subscriberCount }}Subscribers</p>
						
            			
				</div>
			</div>
			<div v-else>
				<div id="video">
					<div class="thumbnail">
						<img class="thumbnail" :src="video.thumbnails[0].url" width="100%" />
						<p id="duration">{{ video.duration / 100 }} Min</p>
					</div>
					<a @click="watchWithId(video.id)" ><p>{{ video.title }}</p></a>
					<p>{{ video.channel?video.channel.name:"" }} </p>
					<p>{{ video.uploadDate }} {{ video.viewCount / 1000 }}K</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SubscribeButton from '../components/SubscribeButton.vue';
export default {
	components: {
		SubscribeButton,
	},
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
