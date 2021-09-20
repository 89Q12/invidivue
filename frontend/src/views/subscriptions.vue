<template>
<div>
    <h1>
    Subscriptions
    </h1>
    <!--<p style="white-space: pre;">
    {{JSON.stringify(subscriptions[0].jsoncache, null, 2)}}
    </p>-->
    <div class="channellist" v-for="sub in subscriptions" v-bind:key="sub">
        <div class="channelthumbnail ">
        <img class="rounded-circle" :src="sub.jsoncache.authorThumbnails[0].url">
        <SubscribeButton :cid="sub.jsoncache.authorId" unsub/>
        </div>
        <router-link :to="'channel?id='+sub.jsoncache.authorId ">
        <div class="infotextright">
        <p>{{sub.jsoncache.author}}</p>
        <p>{{sub.jsoncache.authorId}}</p>
        <a>{{sub.jsoncache.authorUrl}}</a>
        <p>{{sub.jsoncache.subscriberText}}</p>
        
        </div>
        </router-link>

    </div>
</div>
</template>
<script lang="ts">
import SubscribeButton from '../components/SubscribeButton.vue';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
export default {
    components: {
		SubscribeButton,
	},
    setup() {
        const store = useStore();
        //const { data:subscriptions } = await axios.get('http://localhost:5000/ay/subscriptions',{headers: {'Authorization': "Bearer "+localStorage.getItem('token')}});
        const subscriptions=ref();
        axios.get('http://localhost:5000/ay/subscriptions',{headers: {'Authorization': "Bearer "+ store.state.user_store_module.user.accessToken}})
        .then((res: AxiosResponse) => {
            console.log(res.data.subscriptions)
            const subs = res.data.subscriptions;
            subs.forEach((e:any) => {
                e.jsoncache=JSON.parse(e.cache);
            });
            subscriptions.value=subs;
        })
        return {subscriptions};
    }
}
</script>
<style lang="scss">
.channellist{
    border-bottom: 1px solid black;
    padding-top: 1em;
}
.channelthumbnail{
    float: left;
}
.infotextright{
    padding-left:1em;
    display:inline-block;
}
</style>