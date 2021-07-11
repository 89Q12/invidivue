<template>
	<div class="center">
		<form class="loginForm">
			<fieldset>
				<label>Username</label>
				<input type="text" v-model="form.username" required />
				<label>Password</label>
				<input type="password" v-model="form.password" />
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
				<button type="submit" @click="submitForm">Login</button>
			</fieldset>
		</form>
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
				.post('http://localhost:5000/api/users/login', form, { withCredentials: true })
				.then((res: AxiosResponse) => {
					localStorage.setItem('loggedIn', 'true');
					router.push('/');
				})
				.catch((error: AxiosError) => {
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
.loginForm {
	color: #ffffff;
	word-wrap: break-word;
}
.loginForm fieldset input {
	padding: 0.5em 0.6em;
	margin-top: 0.5em;
	margin-bottom: 0.5em;
	border-radius: 4px;
	width: 100%;
	height: 50%;
}
.loginForm fieldset input:focus {
	outline: none;
}
.loginForm fieldset {
	border: none;
}
button {
	font-size: 100%;
	margin-top: 0.5em;
	padding: 0.5em 1em;
	background-color: #a0a0a0;
	box-shadow: none;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}
</style>
