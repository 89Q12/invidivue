<template>
	<div class="center">
		<div class="form">
				<label>Username</label>
				<input type="text" v-model="form.username" required />
				<label>Password</label>
				<input type="password" v-model="form.password" />
                <label>Repeat Password</label>
				<input type="password" v-model="form.passwordrepeat" />
                <p><img :src="captchaimg" @click="pointImage"></p>
                <label>Captcha</label>
				<input readonly type="text" v-model="form.captcha" required />
				<div v-if="Errors.length">
					<div>
						<ul>
							<li class="error" v-for="error in Errors" :key="error">{{ error }}</li>
						</ul>
					</div>
				</div>
				<div>
					<router-link to="/signup">Create an account</router-link>
				</div>
				<button type="submit" @click="submitForm">Login</button>
		</div>
	</div>
</template>
<script lang="ts">
import axios, { AxiosError, AxiosResponse } from 'axios';
import { reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { UserRegisterSchema } from '../utils/formValidation';
import { useRouter } from 'vue-router';
export default {
	setup() {
        const store = useStore();
		const router = useRouter();
        const form = reactive({
			username: '',
			password: '',
            passwordrepeat:'',
            captcha:'',
		});
        const validForm = ref();
        const Errors = reactive<Array<Error>>([]);
        const captchaimg =ref<string>('');
        const captchaid =ref<number>(0);
        
        axios.get('http://localhost:5000/api/user/getcaptcha')
        .then((res: AxiosResponse) => {
            console.log(res);
            console.log(this)
            captchaimg.value= res.data.captcha
            captchaid.value=res.data.captchaid
        })
        .catch((error: AxiosError) => {
            console.log("getcaptcha failed"+error);
            Errors.push(error.response?.data.message);
        });
        const pointImage=async (e:any): Promise<void> =>{
            var rect = e.target.getBoundingClientRect();
            var x = Math.round(e.clientX - rect.left); //x position within the element.
            var y = Math.round(e.clientY - rect.top);  //y position within the element.
            console.log(x+" "+y)
            form.captcha=x+","+y;
        }
        const submitForm=async (): Promise<void> =>{
            Errors.splice(0, Errors.length);
            validForm.value = await UserRegisterSchema.validate(form).catch((err: Error) => Errors.push(err));
            if (Errors.length) {
				
				return;
			}
            if(form.password!=form.passwordrepeat){
                Errors.push({name:"",message:"passwords are not the same"});
                return;
            }
            axios.post("http://localhost:5000/au/register",
            {username:form.username,password:form.password,captchaid:captchaid.value,captchatext:form.captcha})
            .then((res: AxiosResponse) => {
                console.log("succes")
                router.push('/');
            })
            .catch((error: AxiosError) => {
                console.log("getcaptcha failed"+error);
                Errors.push(error.response?.data.message);
            });
            return;
        };
        return {
			form,
			submitForm,
            pointImage,
            captchaimg,
			Errors,
			store,
		};
    }}
</script>