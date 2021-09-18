<template>
	<div class="channel">
		<div v-if="results.channel">
            
            <img class="banner" :src="results.channel.authorBanners[0].url">
            
            <img :src="results.channel.authorThumbnails[0].url">
            <SubscribeButton :cid="results.channel.authorId"/>
            <p>{{results.channel.author}}</p>
            <p>{{results.channel.authorId}}</p>
            <a>{{results.channel.authorUrl}}</a>
            <p>{{results.channel.subscriberText}}</p>
            <!--<p>{{results.channel.subscriberCount}}</p>-->
            <p>{{results.channel.description}}</p>
            
            <p>Family friendly:{{results.channel.isFamilyFriendly?'✔':'✖'}}</p>
            <p>verified:{{(results.channel.isVerified)?'✔':'✖'}}</p>
            <p>idtype: {{results.channel.channelIdType}}</p>
        </div>
        <div v-else>Channel not found</div>
	</div>
</template>
<script lang="ts">
import { ref, computed, onMounted } from 'vue';
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
		const results = computed(() => store.state.video_store_module.channel);
        
      
		if(router.currentRoute.value.query.id){
			store.dispatch('get_channel', router.currentRoute.value.query.id);
		}
		return {
            results,
			router,
			store,
		};
	},
};
</script>
<style lang="scss">
.banner{
width: -moz-available;
}
</style>