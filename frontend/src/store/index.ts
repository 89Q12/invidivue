import { createStore } from 'vuex';
import { video_store_module } from './modules/video_store_module';
import { user_store_module } from './modules/user_store_module';
export default createStore({
	modules: {
		video_store_module,
		user_store_module,
	},
});
