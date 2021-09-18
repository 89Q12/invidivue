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
    props: ['cid'],
    setup(props:any) {
        const store = useStore();
        const buttontext =  computed(() =>{
            if (store.state.user_store_module.user.subscriptions.includes(store.state.video_store_module.channel.id)){
                return "Unsubscribe"
            }else{
                return "Subscribe"
            }
        });
        store.subscribe((mutation, state) => {
			if(mutation.type == "set_error"){
                console.log(state);
            }
        }
        );
        const subscribe=()=>{
            if (buttontext.value === "Subscribe"){
                store.dispatch('subscribe_to_channel',props.cid)
            }else{
                store.dispatch('unsubscribe_to_channel', props.cid)
            }
        }

        return {subscribe,buttontext};
    }
}
</script>