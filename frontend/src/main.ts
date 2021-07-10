import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Oruga from '@oruga-ui/oruga-next';
import '@oruga-ui/oruga-next/dist/oruga.css';

createApp(App).use(Oruga).use(store).use(router).mount('#app');
