<template>
    <div class="channelpicture">
    <div class="d-flex justify-content-center">
        <img class="rounded-circle w-50" :src="props.video.thumbnails[0].url" />
    </div>
    <p><SubscribeButton :cid="props.video.id" /></p>
        <router-link :to="'/channel??id='+ props.video.id" ><p>{{ props.video.name }}</p></router-link>
        <p>{{ props.video.videoCount }} videos</p>
        <p>{{ props.video.subscriberCount }}Subscribers</p> 
    </div>
</template>
<script lang="ts">
import SubscribeButton from './SubscribeButton.vue';
export default{
    props:{
        video: { default: {}}
    },
    components: {
		SubscribeButton,
	},
    setup(props: any) {
        return{
            props,

        }
    },
}
</script>
