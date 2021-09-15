<template>
	<div class="center">
		<div class="form">
			<label>Username</label>
			<input type="text" v-model="form.username" required />
			<label>Password</label>
			<input type="password" v-model="form.password" @keyup.enter="submitForm" />
			<div v-if="Errors.length">
				<div>
					<ul>
						<li v-for="error in Errors" :key="error">{{ error }}</li>
					</ul>
				</div>
			</div>
			<div>
				<router-link to="/signup">Create an account</router-link>
			</div>
			<button @click="submitForm">Login</button>
		</div>
	</div>
</template>

<script lang="ts">
import axios, { AxiosError, AxiosResponse } from 'axios';
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { UserLoginSchema } from '../utils/formValidation';
import { useRouter } from 'vue-router';
export default {
	setup() {
		const store = useStore();
		const router = useRouter();
		const form = reactive({
			username: '',
			password: '',
		});
		const validForm = ref();
		const Errors = reactive<Array<Error>>([]);

		async function submitForm(): Promise<void> {
			Errors.splice(0, Errors.length);
			validForm.value = await UserLoginSchema.validate(form).catch((err: Error) => Errors.push(err));
			if (Errors.length) {
				form.username = '';
				form.password = '';
				return;
			}
			await axios
				.post('http://localhost:5000/api/user/login', form, { withCredentials: false })
				.then((res: AxiosResponse) => {
					localStorage.setItem('loggedIn', 'true');
					localStorage.setItem('username', form.username);
					store.dispatch('set_username', form.username);
					console.log("succes login");
					router.push('/');
				})
				.catch((error: AxiosError) => {
					console.log("login failed"+error);
					localStorage.setItem('loggedIn', 'false');
					Errors.push(error.response?.data.message);
				});
		}
		return {
			form,
			submitForm,
			Errors,
			store,
		};
	},
};
</script>
<style lang="scss">

</style>
