<template>
	<div class="video">
		<div v-if="video" class="player">
			<video :src="videosrc===''?video.formats[0].url:videosrc" @timeupdate="timeupdate(e)" @ended="ended(e)" @error="videoerror(e)" controls autoplay></video>
		</div>
		<div class="videoInfo">
			<select @change="(e)=>changeformat(e.target.value)" :options="video.formats" v-model="selected">
				<option  v-for="format in video.formats" v-bind:key="format" :value="format.itag">
					{{
						format.qualityLabel
						?format.container+" "+format.qualityLabel
						:(format.container+" "+format.codecs)}}
						{{format.hasVideo?(format.hasAudio?"":" Video only"):(format.hasAudio?" Audio only":"")}}
					</option>
			</select>

			<p>{{ video.videoDetails.title }}</p>
			<a  @click="goToChannel" ><p>{{ video.videoDetails.author.name }}| {{ video.videoDetails.author.subscriber_count / 1000 }}K</p></a>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
	setup() {
		const store = useStore();
		const router = useRouter();
		if(router.currentRoute.value.query.id){
			store.dispatch('get_current_video', router.currentRoute.value.query.id);
		}
		const videosrc = ref("");
		const video = computed(() => {
			return store.state.video_store_module.current_video;});
		onMounted(() => {
			console.log(localStorage.getItem('current_video'));
			if (localStorage.getItem('current_video')) {
				store.dispatch('get_current_video', localStorage.getItem('current_video'));
			}
		});
		
		videosrc.value="";
		async function watchWithId(id: string) {
			await store.dispatch('get_current_video', id);
			localStorage.setItem('current_video', id);
			router.push({ path: 'video', query: { id: id }});
		}
		async function goToChannel(){
			await store.dispatch('get_channel', video.value.channelId);
			router.push({path: 'channel', query: { query: video.value.channelId }});
		}
		
		const changeformat= (e:any)=>{
			video.value.formats.forEach((format:any) => {
				if((""+format.itag) === e){
					console.log(format.url)
					videosrc.value=format.url;
				}
			});
			
		}
		const timeupdate =(e:any)=>{
			console.log(e);
		}
		const ended =(e:any)=>{
			console.log(e);
			//watchWithId(video.value.related_videos[0].id)//AUTOPLAY
		}
		const videoerror=(e:any)=>{
			console.log(e);
		}
		return {
			video,
			router,
			watchWithId,
			store,
			goToChannel,
			changeformat,
			videosrc,
			timeupdate,
			ended,
			videoerror,
		};
	},
};
</script>
