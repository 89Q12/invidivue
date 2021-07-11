<template>
	<header>
		<nav>
			<div class="start">
				<router-link to="/">INVIDIVUE</router-link>
			</div>
			<div class="menu-item-search">
				<input class="searchBar" placeholder="Search something" />
			</div>
			<div v-show="false">
				<router-link to="/" class="menu-item-top" @click="store.dispatch('logout')">Logout</router-link>
			</div>
			<div class="end">
				<router-link to="/signin" class="menu-item-top">Login</router-link>
			</div>
		</nav>
	</header>
</template>
<style lang="scss">
header {
	top: 0;
	width: 100%;
	height: 10vh;
	z-index: 999;

	.o-switch__label {
		color: #000000;
	}

	p {
		color: #000000;
	}
}

a {
	color: #ffffff;
	text-decoration: none;
}
.searchBar {
	background-color: #232323;
	padding-bottom: 10px;

	color: #ffffff;
	font-size: 100%;
	text-align: left;

	border: none;
	border-bottom: 1px solid;

	width: 100%;
}
.searchBar:focus {
	outline: none;
}

nav {
	height: 100%;
	display: flex;
	flex-flow: row wrap;
	align-items: center;
	justify-content: center;
}
nav div {
	width: 33.33%;
}
nav .end {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
nav .start {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}

nav .menu-item {
	color: blue($color: #000000);
	padding: 10px 40px;

	text-align: center;
	border-bottom: 3px solid transparent;
}

nav .menu-item.active,
nav .menu-item:hover {
	background-color: rgb(0, 0, 0);
	border-block-color: #e1cc81;
}

nav .menu-item a {
	color: inherit;
	text-decoration: none;
}

nav .menu-item-top {
	color: blue($color: #000000);
	position: relative;
	text-align: center;
	border-bottom: 3px solid transparent;
}
nav .menu-item-search {
	color: blue($color: #000000);
	padding: 10px;
	position: relative;
	text-align: center;
	border-bottom: 3px solid transparent;
}

nav .menu-item-top.active,
nav .menu-item-top:hover {
	background-color: #000000;
}

nav .menu-item-top a {
	color: inherit;
	text-decoration: none;
}
@media screen and (max-width: 650px) {
	nav {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
	}
	nav .menu-item-top {
		color: blue($color: #000000);
		position: relative;
		text-align: center;
	}
	nav .menu-item-search {
		color: blue($color: #000000);
		padding: 10px;
		position: relative;
		text-align: center;
		border-bottom: 3px solid transparent;
		width: 100%;
		height: 100%;
	}
	nav .end {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	nav .start {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
}
</style>
