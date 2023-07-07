<script>
	import Episodes from '../../lib/components/id/Episodes.svelte';
	import Description from '../../lib/components/id/Description.svelte';
	export let data;
	// const { zoro, gogoanime, animephae, title } = data;
	import { currentEp, currentProvider } from '$lib/stores/playerStore.js';
	import { onMount } from 'svelte';
	import Player from '../../lib/components/id/Player.svelte';
	import Player2 from '../../lib/components/id/Player2.svelte';
	import AnimeDetails from '../../lib/components/id/AnimeDetails.svelte';
	import Comment from '../../lib/components/id/Comment.svelte';

	$: anime = data.zoro;
	$: gogoAnime = data.gogoanime;
	$: animephaeAnime = data.animephae;
</script>

<div class="main mt-24 md:px-6 flex flex-col lg:flex-row gap-10 lg:gap-4">
	<div class="left-content w-full lg:w-2/3 relative z-0">
		<div class="player relative aspect-video w-full">
			<!-- <div class="absolute blur-xl border inset-0">
				<img src="https://proxy-for-movie-app.yashgajbhiye10.workers.dev/{$currentEp?.image}" alt="" class="w-full h-full opacity-50 object-cover">
			</div> -->
			{#key $currentEp?.id}
				<Player2 malId={anime?.malId} {anime} />
			{/key}
		</div>
		<div class="discription w-full px-4 space-y-4 md:px-0">
			<Description {anime} />
			<!-- <AnimeDetails {anime} /> -->
			<Comment />
		</div>
	</div>
	<div class="right-content w-full lg:flex-1 relative z-10">
		<Episodes {anime} {gogoAnime} {animephaeAnime} />
	</div>
</div>
