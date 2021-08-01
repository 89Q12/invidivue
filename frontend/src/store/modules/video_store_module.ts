import axios, { AxiosError, AxiosResponse } from 'axios';
export const video_store_module = {
	state: () => ({
		popular_videos: [],
		trend_videos: [],
		current_video: {},
		channel: {},
		search_results: [],
		errors: [] as AxiosError[],
	}),
	mutations: {
		set_popular(state: any, popular_videos: Array<Record<string, unknown>>) {
			state.popular_videos = popular_videos;
		},
		set_trend_videos(state: any, trend_videos: Array<Record<string, unknown>>) {
			state.trend_videos = trend_videos;
		},
		set_current_video(state: any, current_video: Record<string, unknown>) {
			state.current_video = current_video;
		},
		set_channel(state: any, channel: Record<string, unknown>) {
			state.channel = channel;
		},
		set_search_result(state: any, result: Array<Record<string, unknown>>) {
			state.search_results = result;
		},
		set_error(state: any, error: AxiosError) {
			state.errors.push(error);
		},
	},
	actions: {
		async get_popular(context: any) {
			try {
				const response: AxiosResponse = await axios.get('route to popular');
				context.commit('set_popular', response.data);
			} catch (err: any) {
				context.commit('set_error', err);
			}
		},
		async get_trends(context: any) {
			try {
				const response: AxiosResponse = await axios.get('route to trends');
				context.commit('set_trend_videos', response.data);
			} catch (err: any) {
				context.commit('set_error', err);
			}
		},
		async get_current_video(context: any, videoID: string) {
			try {
				const response: AxiosResponse = await axios.get('/watch?v=' + videoID);
				context.commit('set_current_video', response.data);
			} catch (err: any) {
				context.commit('set_error', err);
			}
		},
		async get_channel(context: any, channelID: string) {
			try {
				const response: AxiosResponse = await axios.get('/channel/' + channelID);
				context.commit('set_channel', response.data);
			} catch (err: any) {
				context.commit('set_error', err);
			}
		},
		async get_search_result(context: any, search_query: string) {
			try {
				const response: AxiosResponse = await axios.get('/results?q=' + search_query);
				context.commit('set_search_result', response.data);
			} catch (err: any) {
				context.commit('set_error', err);
			}
		},
	},
};
