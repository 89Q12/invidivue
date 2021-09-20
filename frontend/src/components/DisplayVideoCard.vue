<template>
    <div id="video">
        <div class="thumbnail">
            <img class="thumbnail" :src="props.video.thumbnails[0].url" width="100%" />
            <p id="duration">{{ props.video.duration?(secondstostring(props.video.duration)):secondstostring(props.video.length_seconds) }} Min</p>
        </div>
        <router-link :to="'/video?v='+props.video.id"><p>{{ props.video.title }}</p></router-link>
        <router-link :to="'/channel?id='+
        (props.video.channel?props.video.channel.id:
        (props.video.author?props.video.author.id:''))" > 
            <p>{{ props.video.channel?video.channel.name:(props.video.author?video.author.name:'') }} </p>
        </router-link>
        <p>{{ props.video.uploadDate?props.video.uploadDate:props.video.published }} {{ props.video.viewCount?(props.video.viewCount / 1000):props.video.short_view_count_text }}</p>
    </div>
</template>
<script lang="ts">
export default{
    
    props:{
        video: { default: {}}
    },
    setup(props: any) {
        const secondstostring=(s:number)=>{
            const sec = s%60;
            const mins = Math.floor(s/60);
            const hours = Math.floor(mins/60);
            return (hours>0?(hours+":"):"")+mins+":"+(sec<10?'0':'')+sec;
        };
        return{
            props,
            secondstostring
        }
    },
}
</script>
