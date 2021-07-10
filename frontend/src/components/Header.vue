<template>
	<header>
		<nav>
			<router-link to="/" class="menu-item-invidivue">INVIDIVUE</router-link>
			<div class="menu-item-search search">
				<input placeholder="Search something" />
			</div>
			<div>
				<router-link to="/" class="menu-item-top" @click="store.dispatch('logout')">Logout</router-link>
			</div>
			<div>
				<router-link to="/login" class="menu-item-top">Login</router-link>
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
input {
	background-color: #232323;
	padding-bottom: 10px;

	color: #ffffff;
	font-size: 100%;
	text-align: center;

	border: none;
	border-bottom: 1px solid;

	width: 90%;
}
input:focus {
	outline: none;
}
div .search {
	width: 20%;
}
nav {
	height: 100%;
	display: flex;
	align-items: center;
	margin-left: 5vw;
	margin-right: 5vw;
}

nav .menu-item {
	color: blue($color: #000000);
	padding: 10px 40px;
	position: relative;

	text-align: center;
	border-bottom: 3px solid transparent;

	display: flex;
	transition: 400ms;
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
	padding: 10px 30px;
	position: relative;
	text-align: center;
	border-bottom: 3px solid transparent;
	display: flex;
	transition: 400ms;
	margin-left: auto;
}
nav .menu-item-search {
	color: blue($color: #000000);
	padding: 10px;
	position: relative;
	text-align: center;
	border-bottom: 3px solid transparent;
	display: flex;
	margin: auto;
}
nav .menu-item-invidivue {
	color: blue($color: #000000);
	font-size: 100%;
	font-weight: bold;
}

nav .menu-item-logout {
	color: #ffffff;
	background-color: #ffffff00;
	padding: 10px 30px;
	position: relative;
	text-align: center;
	border: 0px solid transparent;
	display: flex;
	transition: 400ms;

	nav .menu-item-logout.active,
	nav .menu-item-logout:hover {
		background-color: #000000;
	}
}

nav .menu-item-top.active,
nav .menu-item-top:hover {
	background-color: #000000;
}

nav .menu-item-top a {
	color: inherit;
	text-decoration: none;
}
</style>
