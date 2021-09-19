import axios, { AxiosError, AxiosResponse } from 'axios';
import router from '@/router';
const url = 'http://localhost:5000/api/user';
export const user_store_module = {
    state: () => ({
        loggedIn: false,
        user: {
            username: '',
            password: '',
            subscriptions: [] ,
            isAdmin: false,
            isAuthenticated: false,
            accessToken: '',
        },
        notifications:[{
            video: {},
            channel: {},
            seen: false,
        }]
    }),
	mutations: {
		setLoggedInUser(state: any, user: any) {
			state.user.username = user.name || '';
			state.user.password = user.password || '';
			state.user.subscriptions = user.subscriptions || [];
			state.user.isAuthenticated = true;
			state.user.isAdmin = user.admin || false;
		},
		setUserLoggedOut(state: any) {
			state.user.username = '';
			state.user.password = '';
			state.user.subscriptions = [];
			state.user.isAuthenticated = false;
			state.user.isAdmin = false;
		},
        AddSubscription(state: any, channelID: string){
            state.user.subscriptions.push(channelID)
        },
        DelSubscription(state: any, channelID: string){
            state.user.subscriptions.splice(state.user.subscriptions.indexOf(channelID), 1);
        },
        setAccessToken(state: any, token: string) {
			state.user.accessToken = token;
		},
    },
    actions: {
		async getloggedInUser(context: any) {
			const value = localStorage.getItem('loggedIn') || 'false';
			if (JSON.parse(value) === true && context.state.user.accessToken) {
				await axios
					.get(url + '/getuser', {
						headers: {
							Authorization: 'Bearer ' + context.state.user.accessToken,
						},
					})
					.then((res: AxiosResponse) => context.commit('setLoggedInUser', res.data))
					.catch((error: AxiosError) => {
						console.log(error);
					});
			} else if (JSON.parse(value) === true && !context.state.user.accessToken) {
				await axios
					.post(
						url + '/refreshtoken',
						{},
						{
							withCredentials: true,
							xsrfCookieName: 'refreshtoken',
						},
					)
					.then((res: AxiosResponse) => {
						context.commit('setAccessToken', res.data.accesstoken);
						console.log(res.data.accesstoken)
						axios
							.get(url + '/getuser', {
								headers: {
									withCredentials: true,
									Authorization: 'Bearer ' + res.data.accesstoken,
								},
							})
							.then((res: AxiosResponse) => context.commit('setLoggedInUser', res.data))
							.catch((error: AxiosError) => {
								console.log(error);
							});
					})
					.catch((error: AxiosError) => {
						if (error.response?.status != 500) {
							context.commit('setUserLoggedOut');
							router.push('signin')
						}
					});
			}
		},
		async logout(context: any) {
			await axios
				.post(
					url + '/logout',
					{},
					{
						withCredentials: true,
						headers: {
							Authorization: 'Bearer ' + context.state.user.accessToken,
						},
					},
				)
				.then((res: AxiosResponse) => {
					context.commit('setUserLoggedOut');
					localStorage.setItem('loggedIn', "false");
				})
				.catch((error: AxiosError) => {
					console.log(error);
				});
		},
    },
};
