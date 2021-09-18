import axios, { AxiosError, AxiosResponse } from 'axios';
const url = 'http://localhost:5000/api/user';
export const user_store_module = {
    state: () => ({
        loggedIn: false,
        user: {
            username: '',
            password: '',
            subscriptions: [] as {},
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
			state.user.username = user.username || '';
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
		async getloggedInUser({ commit, state }) {
			const value = localStorage.getItem('loggedIn') || 'false';
			if (JSON.parse(value) === true && state.user.accessToken) {
				await axios
					.get(url + 'getuser', {
						headers: {
							Authorization: 'Bearer ' + state.user.accessToken,
						},
					})
					.then((res: AxiosResponse) => commit('setLoggedInUser', res.data))
					.catch((error: AxiosError) => {
						console.log(error);
					});
			} else if (JSON.parse(value) === true && !state.user.accessToken) {
				await axios
					.post(
						url + 'refreshtoken',
						{},
						{
							withCredentials: true,
							xsrfCookieName: 'refreshtoken',
						},
					)
					.then((res: AxiosResponse) => {
						commit('setAccessToken', res.data.accesstoken);
						axios
							.get(url + 'getuser', {
								headers: {
									withCredentials: true,
									Authorization: 'Bearer ' + res.data.accesstoken,
								},
							})
							.then((res: AxiosResponse) => commit('setLoggedInUser', res.data))
							.catch((error: AxiosError) => {
								console.log(error);
							});
					})
					.catch((error: AxiosError) => {
						if (error.response?.status != 500) {
							commit('setUserLoggedOut');
						}
					});
			}
		},
		async logout({ commit, state }) {
			await axios
				.post(
					url + 'logout',
					{},
					{
						withCredentials: true,
						headers: {
							Authorization: 'Bearer ' + state.user.accessToken,
						},
					},
				)
				.then((res: AxiosResponse) => {
					commit('setUserLoggedOut');
					localStorage.removeItem('loggedIn');
				})
				.catch((error: AxiosError) => {
					console.log(error);
				});
		},
    },
};
