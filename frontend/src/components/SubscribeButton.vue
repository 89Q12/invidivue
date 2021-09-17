<template>
<div class="sub">
    <button @click="subscribe();" >{{buttontext}}</button>
</div>
</template>

<script lang="ts">
import axios, { AxiosError, AxiosResponse } from 'axios';
import { reactive, ref, computed } from 'vue';
export default {
    props: ['cid','unsub'],
    setup(props) {
        //const { data:subscriptions } = await axios.get('http://localhost:5000/ay/subscriptions',{headers: {'Authorization': "Bearer "+localStorage.getItem('token')}});
        const buttontext = ref("Subscribe");
        if(props.unsub==""){
            buttontext.value="Unsubscribe"
        }
        const subscribe=()=>{
            //console.log(props.cid)
            if(buttontext.value=="Subscribe"){
                axios.get('http://localhost:5000/ay/subscribe?cid='+props.cid,{headers: {'Authorization': "Bearer "+localStorage.getItem('token')}})
                .then((res: AxiosResponse) => {
                    console.log(res.data)
                    if(res.data.message=="OK"||res.data.message=="already subscribed"){
                        buttontext.value="Unsubscribe"
                    }
                })
            }else{
                axios.get('http://localhost:5000/ay/unsubscribe?cid='+props.cid,{headers: {'Authorization': "Bearer "+localStorage.getItem('token')}})
                .then((res: AxiosResponse) => {
                    console.log(res.data)
                    if(res.data.message=="OK"){
                        buttontext.value="Subscribe"
                    }
                })
            }
             
        }

        return {subscribe,buttontext};
    }
}
</script>