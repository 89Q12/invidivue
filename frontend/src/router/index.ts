import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/signin',
		name: 'Signin',
		// route level code-splitting
		// this generates a separate chunk (signin.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "signin" */ '../views/signin.vue'),
	},
	{
		path: '/signup',
		name: 'Signup',
		// route level code-splitting
		// this generates a separate chunk (signin.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "signup" */ '../views/signup.vue'),
	},
	{
		path: '/search',
		name: 'Search',
		
		// route level code-splitting
		// this generates a separate chunk (search.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),
	},
	{
		path: '/watch',
		name: 'watch',
		// route level code-splitting
		// this generates a separate chunk (search.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "watch" */ '../views/video.vue'),
	},
	{
		path: '/channel',
		name: 'channel',
		// route level code-splitting
		// this generates a separate chunk (search.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "video" */ '../views/channel.vue'),
	},
	{
		path: '/profile',
		name: 'profile',
		component: () => import('../views/profile.vue'),
	},
	{
		path: '/subscriptions',
		name: 'subscriptions',
		component: () => import('../views/subscriptions.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
	
});

export default router;
