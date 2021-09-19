<template>
    <div id="video">
        <div class="thumbnail">
            <img class="thumbnail" :src="props.video.thumbnails[0].url" width="100%" />
            <p id="duration">{{ props.video.duration / 100 }} Min</p>
        </div>
        <router-link :to="'/video?v='+props.video.id"><p>{{ props.video.title }}</p></router-link>
        <router-link :to="'/channel??id='+ props.video.channel.id" > <p>{{ props.video.channel?video.channel.name:"" }} </p></router-link>
        <p>{{ props.video.uploadDate }} {{ props.video.viewCount / 1000 }}K</p>
    </div>
</template>
<script lang="ts">
export default{
    
    props:{
        video: { default: {}}
    },
    setup(props: any) {
        return{
            props,
        }
    },
}
</script>
