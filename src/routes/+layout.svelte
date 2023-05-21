<script>
	import '../app.css';
	import '@splidejs/svelte-splide/css';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import Navbar from '../lib/components/Navbar.svelte';
	import { afterNavigate, beforeNavigate, invalidateAll } from '$app/navigation';
	import Footer from '../lib/components/Footer.svelte';
	
	NProgress.configure({ showSpinner: false });

	beforeNavigate(() => {
		NProgress.start();
	});
	afterNavigate(() => {
		NProgress.done();
	});

	let y;
</script>

<svelte:window bind:scrollY={y} />

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/artplayer-plugin-hls-quality/dist/artplayer-plugin-hls-quality.js"
	></script>
</svelte:head>

<div class="main font-poppins flex flex-col justify-between min-h-screen relative">
	<Navbar {y} />
	<div class="slot">
		<div class="slot">
			<slot />
		</div>
		<!-- <div class="bg-gradient-to-t z-0 h-96 w-full absolute bottom-0 from-neutral to-base-100" /> -->
	</div>
	<Footer />
</div>
