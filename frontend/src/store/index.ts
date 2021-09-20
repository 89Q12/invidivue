import { createStore } from 'vuex';
import { video_store_module } from './modules/video_store_module';
import { user_store_module } from './modules/user_store_module';
export default createStore({
	actions:{
		async subscribe(context:any, channelID: string){
			context.commit('AddSubscription', channelID)
			context.dispatch('subscribe_to_channel',{
				channelID,
				accessToken: context.state.user_store_module.user.accessToken
			})
		}
	},
	modules: {
		video_store_module,
		user_store_module,
	},
});
