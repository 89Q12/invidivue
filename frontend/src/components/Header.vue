<template>
	<header>
		<nav>
			<router-link to="/" class="menu-item-invidivue">Invidivue</router-link>
			<div class="menu-item-search">
				<o-field>
					<o-autocomplete placeholder="No label"></o-autocomplete>
				</o-field>
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

nav {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 10rem;
	margin-right: 10rem;
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
	padding: 10px 30px;
	position: relative;
	text-align: center;
	border-bottom: 3px solid transparent;
	display: flex;
	transition: 400ms;
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
