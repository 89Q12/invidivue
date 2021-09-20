<template>
	<div class="video row videoInfo">
		<div v-if="video" class="col-12 player">
			<video :src="videosrc===''?video.formats[0].url:videosrc" @timeupdate="timeupdate(e)" @ended="ended(e)" @error="videoerror(e)" controls autoplay></video>
		</div>
		<div class="col-sm-12">
			<h4 style="color: #f0f0f0;">{{ video.videoDetails.title }}</h4>
		
			<div class="row">
				<div class="col-sm-3">
					<select class="col-sm-12" @change="(e)=>changeformat(e.target.value)" :options="video.formats" v-model="selected">
						<option  v-for="format in video.formats" v-bind:key="format" :value="format.itag">
							{{
								format.qualityLabel
								?format.container+" "+format.qualityLabel
								:(format.container+" "+format.codecs)}}
								{{format.hasVideo?(format.hasAudio?"":" Video only"):(format.hasAudio?" Audio only":"")}}
							</option>
					</select>
					
					<router-link :to="'/channel?id='+ video.videoDetails.author.id"> <p>{{ video.videoDetails.author.name }}| {{ video.videoDetails.author.subscriber_count / 1000 }}K</p></router-link>
					<p>Uploaded: {{ video.videoDetails.uploadDate }}</p>
					<p>Views: {{ video.videoDetails.viewCount / 1000 }}K</p>
					<p>Likes: {{ video.videoDetails.likes / 1000 }}K</p>
					<p>dislikes: {{ video.videoDetails.dislikes / 1000 }}K</p>
					
				</div>
				<div class="col-sm-6 h-100">
					<p style="color: #f0f0f0;white-space: pre-line;">{{ video.videoDetails.description }}</p>
				</div>
				<div class="col-sm-3">
					<div v-for="vid in video.related_videos" v-bind:key="vid" class="related">
						<!--
							<img :src="vid.thumbnails[0].url" :height="vid.thumbnails[0].height" :width="vid.thumbnails[0].width" />
							{{ vid.length_seconds / 100 }} Min
							
						<router-link :to="'/video?v='+ vid.id"><p>{{ vid.title }}</p></router-link>
						<router-link :to="'/channel??id='+ vid.author.id"> <p>{{ vid.author.name }}</p></router-link>
						<p>Uploaded: {{ vid.published }} views: {{ vid.view_count / 1000 }}K</p><VideoCard :video="vid"/>-->
						<VideoCard :video="vid"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import VideoCard from '../components/DisplayVideoCard.vue';
export default {
	components: {
		VideoCard
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const videosrc = ref("");
		const video = computed(() => store.state.video_store_module.current_video);
		
		if(router.currentRoute.value.query.v){
			store.dispatch('get_current_video', router.currentRoute.value.query.v);
		}

		videosrc.value="";
		
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
			store,
			changeformat,
			videosrc,
			timeupdate,
			ended,
			videoerror,
		};
	},
};
</script>
