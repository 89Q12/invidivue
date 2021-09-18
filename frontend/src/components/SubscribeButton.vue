<template>
    <div class="sub">
        <button @click="subscribe();" >{{buttontext}}</button>
    </div>
</template>

<script lang="ts">
import axios, { AxiosError, AxiosResponse } from 'axios';
import {ref, computed } from 'vue';
import { useStore } from 'vuex';
export default {
    setup() {
        const store = useStore();
        console.log(store.state);
        //const { data:subscriptions } = await axios.get('http://localhost:5000/ay/subscriptions',{headers: {'Authorization': "Bearer "+localStorage.getItem('token')}});
        const buttontext =  computed(() =>{
            if (store.state.user_store_module.user.subscriptions.includes(store.state.video_store_module.channel.id)){
                return "Unsubscribe"
            }else{
                return "Subscribe"
            }
        });
        const subscribe=()=>{
            if (buttontext.value === "Subscribe"){
                store.dispatch('subscribe_to_channel', store.state.video_store_module.channel.id)
            }else{
                store.dispatch('unsubscribe_to_channel', store.state.video_store_module.channel.id)
            }
        }

        return {subscribe,buttontext};
    }
}
</script>